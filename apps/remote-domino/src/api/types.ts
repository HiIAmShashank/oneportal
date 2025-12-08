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

/**
 * Subscription definition
 */
export interface Subscription {
  subscriptionID: number;
  name: string;
  apiKey: string;
}

/**
 * Paginated subscriptions response
 */
export type PaginatedSubscriptionsResponse = PaginatedResponse<Subscription>;

/**
 * Parameters for fetching subscriptions with optional filters
 */
export interface FetchSubscriptionsParams {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Create subscription request payload
 */
export interface CreateSubscriptionRequest {
  SubscriptionID: number;
  Name: string;
  ApiKey: string;
}

/**
 * Update subscription request payload
 */
export interface UpdateSubscriptionRequest {
  SubscriptionID: number;
  Name: string;
  ApiKey: string;
}

/**
 * Job Type definition
 */
export interface JobType {
  jobTypeId: string;
  jobTypeName: string;
  applicationId: string;
  applicationName: string;
}

/**
 * Paginated job types response
 */
export type PaginatedJobTypesResponse = PaginatedResponse<JobType>;

/**
 * Parameters for fetching job types with optional pagination
 */
export interface FetchJobTypesParams {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Workflow Step Type definition
 */
export interface WorkflowStep {
  workflowTypeId: string;
  workflowTypeName: string;
}

/**
 * Paginated workflow steps response
 */
export type PaginatedWorkflowStepsResponse = PaginatedResponse<WorkflowStep>;

/**
 * Parameters for fetching workflow steps with optional pagination
 */
export interface FetchWorkflowStepsParams {
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Workflow Step Type definition
 */
export interface WorkflowStepType {
  workflowStepTypeId: string;
  workflowStepTypeName: string;
  createdByUserId: string | null;
  utcCreatedDate: string;
  updatedByUserId: string | null;
  utcModifiedDate: string;
}

/**
 * Paginated workflow step types response
 */
export type PaginatedWorkflowStepTypesResponse =
  PaginatedResponse<WorkflowStepType>;

/**
 * Parameters for fetching workflow step types with optional pagination
 */
export interface FetchWorkflowStepTypesParams {
  pageNumber?: number;
  pageSize?: number;
}
