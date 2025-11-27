import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { graphClient } from "../api/graphClient";
import { BATCH_SIZE, DEBOUNCE_MS, MAX_CONCURRENT_BATCHES } from "./constants";

interface GraphPhotoContextType {
  getPhoto: (email: string) => string | null | undefined;
  registerInterest: (email: string) => void;
}

const GraphPhotoContext = createContext<GraphPhotoContextType | null>(null);

interface PhotoState {
  [email: string]: {
    url: string | null;
    status: "pending" | "loading" | "loaded" | "error";
  };
}

export function GraphPhotoProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [photos, setPhotos] = useState<PhotoState>({});

  // Refs for batch processing management
  const pendingEmailsRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeBatchesRef = useRef(0);
  const batchQueueRef = useRef<string[][]>([]);

  // Add result to state
  const updatePhotoState = useCallback(
    (
      email: string,
      url: string | null,
      status: PhotoState[string]["status"],
    ) => {
      setPhotos((prev) => ({
        ...prev,
        [email]: { url, status },
      }));
    },
    [],
  );

  // Better cleanup strategy: Track created URLs in a ref
  const createdUrlsRef = useRef<Set<string>>(new Set());

  // Intercept updatePhotoState to track URLs
  const trackAndSetPhoto = useCallback(
    (
      email: string,
      url: string | null,
      status: PhotoState[string]["status"],
    ) => {
      if (url) createdUrlsRef.current.add(url);
      updatePhotoState(email, url, status);
    },
    [updatePhotoState],
  );

  // Process a single batch of emails
  const processBatch = useCallback(
    async (emails: string[]) => {
      if (emails.length === 0) return;

      activeBatchesRef.current++;

      try {
        // Mark as loading
        setPhotos((prev) => {
          const next = { ...prev };
          emails.forEach((email) => {
            if (next[email]) {
              next[email] = { ...next[email], status: "loading" };
            }
          });
          return next;
        });

        // Construct batch request
        const requests = emails.map((email, index) => ({
          id: index.toString(),
          method: "GET",
          url: `/users/${email}/photo/$value`,
        }));

        const response = await graphClient.api("/$batch").post({ requests });
        const responses = response.responses;

        // Process responses
        for (const res of responses) {
          const index = parseInt(res.id, 10);
          const email = emails[index];

          if (email) {
            // Check email exists
            if (res.status === 200 && res.body) {
              let blob: Blob;
              if (typeof res.body === "string") {
                // Base64 string
                const byteCharacters = atob(res.body);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                blob = new Blob([byteArray], {
                  type: res.headers?.["Content-Type"] || "image/jpeg",
                });
              } else {
                blob = new Blob([res.body], { type: "image/jpeg" });
              }

              const url = URL.createObjectURL(blob);
              trackAndSetPhoto(email, url, "loaded");
            } else if (res.status === 429) {
              // Throttled
              console.warn(`Throttled for ${email}, retrying later`);
              trackAndSetPhoto(email, null, "error");
            } else {
              // 404 or other error
              trackAndSetPhoto(email, null, "loaded"); // "loaded" but null url means no photo found
            }
          }
        }
      } catch (error) {
        console.error("Batch photo fetch error", error);
        // Mark all as error
        emails.forEach((email) => trackAndSetPhoto(email, null, "error"));
      } finally {
        activeBatchesRef.current--;
      }
    },
    [trackAndSetPhoto],
  );

  // Simpler: Define a 'triggerNext' function that doesn't change.
  const triggerNext = useCallback(() => {
    if (
      batchQueueRef.current.length > 0 &&
      activeBatchesRef.current < MAX_CONCURRENT_BATCHES
    ) {
      const nextBatch = batchQueueRef.current.shift();
      if (nextBatch) {
        // We need to call the *latest* processBatchWithTrigger which is stored in ref
        // This avoids direct circular dependency in definitions
        if (processBatchRef.current) {
          processBatchRef.current(nextBatch);
        }
      }
    }
  }, []);

  // Update processBatch to call triggerNext
  const processBatchWithTrigger = useCallback(
    async (emails: string[]) => {
      await processBatch(emails);
      triggerNext();
    },
    [processBatch, triggerNext],
  );

  // Ref to processBatch to break circular dependency
  const processBatchRef =
    useRef<(emails: string[]) => Promise<void> | null>(null);

  // Update ref
  useEffect(() => {
    processBatchRef.current = processBatchWithTrigger;
  }, [processBatchWithTrigger]);

  // Flush pending emails into batches
  const flushPending = useCallback(() => {
    const emails = Array.from(pendingEmailsRef.current);
    pendingEmailsRef.current.clear();

    if (emails.length === 0) return;

    // Split into chunks of BATCH_SIZE
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const chunk = emails.slice(i, i + BATCH_SIZE);
      batchQueueRef.current.push(chunk);
    }

    triggerNext();
  }, [triggerNext]);

  const registerInterest = useCallback(
    (email: string) => {
      if (!email) return;

      // If already known (loaded, loading, or error), ignore
      setPhotos((prev) => {
        if (prev[email]) return prev;

        // If not known, add to pending
        if (!pendingEmailsRef.current.has(email)) {
          pendingEmailsRef.current.add(email);

          // Initialize state as pending
          const newState = {
            ...prev,
            [email]: { url: null, status: "pending" } as const,
          };

          // Debounce flush
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(flushPending, DEBOUNCE_MS);

          return newState;
        }
        return prev;
      });
    },
    [flushPending],
  );

  const getPhoto = useCallback(
    (email: string) => {
      return photos[email]?.url;
    },
    [photos],
  );

  // Cleanup effect
  useEffect(() => {
    // Copy ref to variable inside effect for cleanup to avoid lint warning
    const createdUrls = createdUrlsRef.current;
    return () => {
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <GraphPhotoContext.Provider value={{ getPhoto, registerInterest }}>
      {children}
    </GraphPhotoContext.Provider>
  );
}

export function useGraphPhoto(email?: string) {
  const context = useContext(GraphPhotoContext);
  if (!context) {
    throw new Error("useGraphPhoto must be used within a GraphPhotoProvider");
  }

  useEffect(() => {
    if (email) {
      context.registerInterest(email);
    }
  }, [email, context]);

  return email ? context.getPhoto(email) : null;
}
