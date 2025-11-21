import { createContext, useContext, type ReactNode } from "react";
import { type ApiUser } from "../api/types";
import { useUser } from "../hooks/useUser";
import { AuthLoadingSpinner } from "@one-portal/ui";

interface UserContextValue {
  user: ApiUser | undefined;
  isLoading: boolean;
  error: unknown;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <AuthLoadingSpinner
        title="Loading user profile..."
        description="Please wait while we fetch your profile."
      />
    );
  }

  if (error) {
    // You might want a better error handling UI here
    return <div>Error loading user profile: {String(error)}</div>;
  }

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
