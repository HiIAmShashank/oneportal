import type { TokenResult } from "../utils/acquireToken";

const GRAPH_API_BASE = "https://graph.microsoft.com/v1.0";

export interface GraphUser {
  id: string;
  displayName: string | null;
  givenName: string | null;
  surname: string | null;
  userPrincipalName: string;
  mail: string | null;
  jobTitle: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  businessPhones: string[];
  preferredLanguage: string | null;
}

export interface GraphManager {
  id: string;
  displayName: string | null;
  givenName: string | null;
  surname: string | null;
  userPrincipalName: string;
  mail: string | null;
  jobTitle: string | null;
}

export interface GraphDirectReport {
  id: string;
  displayName: string | null;
  givenName: string | null;
  surname: string | null;
  userPrincipalName: string;
  mail: string | null;
  jobTitle: string | null;
}

export interface GraphError {
  error: {
    code: string;
    message: string;
    innerError?: {
      "request-id": string;
      date: string;
    };
  };
}

export class GraphClient {
  private baseUrl: string;

  constructor(baseUrl: string = GRAPH_API_BASE) {
    this.baseUrl = baseUrl;
  }

  /**
   * Requires scope: User.Read
   */
  async getUserProfile(tokenResult: TokenResult): Promise<GraphUser> {
    const endpoint = `${this.baseUrl}/me`;
    const response = await this.fetchGraphAPI<GraphUser>(
      endpoint,
      tokenResult.accessToken,
    );
    return response;
  }

  /**
   * Requires scope: User.Read.All or User.ReadBasic.All
   */
  async getManager(tokenResult: TokenResult): Promise<GraphManager | null> {
    const endpoint = `${this.baseUrl}/me/manager`;
    try {
      const response = await this.fetchGraphAPI<GraphManager>(
        endpoint,
        tokenResult.accessToken,
      );
      return response;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Requires scope: User.Read.All
   */
  async getDirectReports(
    tokenResult: TokenResult,
  ): Promise<GraphDirectReport[]> {
    const endpoint = `${this.baseUrl}/me/directReports`;
    const response = await this.fetchGraphAPI<{ value: GraphDirectReport[] }>(
      endpoint,
      tokenResult.accessToken,
    );
    return response.value;
  }

  private async fetchGraphAPI<T>(
    endpoint: string,
    accessToken: string,
  ): Promise<T> {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: GraphError = await response.json().catch(() => ({
        error: {
          code: "UnknownError",
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      }));

      if (import.meta.env.DEV) {
        console.error("[GraphClient] API call failed", {
          endpoint,
          status: response.status,
          error: errorData.error,
        });
      }

      throw new GraphAPIError(
        errorData.error.message,
        errorData.error.code,
        response.status,
        errorData,
      );
    }

    return response.json();
  }

  private isNotFoundError(error: unknown): boolean {
    return error instanceof GraphAPIError && error.statusCode === 404;
  }
}

export class GraphAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public details?: GraphError,
  ) {
    super(message);
    this.name = "GraphAPIError";
  }
}

export const graphClient = new GraphClient();
