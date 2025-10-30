// packages/auth/src/events/index.ts
// Event bus barrel export

export type {
  AuthEventType,
  AuthEvent,
  AuthEventHandler,
  UnsubscribeFn,
} from './types';

export { isAuthEvent } from './types';

export {
  publishAuthEvent,
  subscribeToAuthEvents,
  closeAuthEventBus,
} from './AuthEventBus';
