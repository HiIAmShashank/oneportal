/**
 * Domino Event System API Types
 */

/**
 * Event from the Domino Event System
 */
export interface Event {
  eventID: string;
  application: string;
  eventType: string;
  eventData: string; // JSON string
  resourceID: string | null;
  resourceType: string | null;
  isSecure: boolean;
  correlationID: string;
  utcCreatedDate: string; // ISO date string
  jobCount: number;
  jobCompletedCount: number;
  utcLastActivityDate: string; // ISO date string
}

/**
 * Generic paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Paginated events response
 */
export type PaginatedEventsResponse = PaginatedResponse<Event>;

/**
 * Event Type definition
 */
export interface EventType {
  eventTypeID: string;
  name: string;
  dataDefinition: string | null;
  publisherID: string | null;
}

/**
 * Paginated event types response
 */
export type PaginatedEventTypesResponse = PaginatedResponse<EventType>;

/**
 * Application definition
 */
export interface Application {
  applicationID: string;
  name: string;
  emailAddress: string;
  hasSecureAccess: boolean;
  subscriptionId: number;
}

/**
 * Paginated applications response
 */
export type PaginatedApplicationsResponse = PaginatedResponse<Application>;

/**
 * Parameters for fetching events with optional filters
 */
export interface FetchEventsParams {
  pageNumber?: number;
  pageSize?: number;
  eventTypeId?: string;
  applicationId?: string;
  correlationId?: string;
}

/**
 * Parameters for fetching event types with optional pagination
 */
export interface FetchEventTypesParams {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Parameters for fetching applications with optional pagination
 */
export interface FetchApplicationsParams {
  pageNumber?: number;
  pageSize?: number;
}
