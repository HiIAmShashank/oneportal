import type { AuthEvent, AuthEventHandler, AuthEventType, AuthEventData, UnsubscribeFn } from './types';
import { isAuthEvent } from './types';

const CHANNEL_NAME = 'oneportal:auth';

let broadcastChannel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel {
  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
  return broadcastChannel;
}

/**
 * Publish a strictly-typed auth event to all listening apps
 * 
 * @example
 * ```typescript
 * // Type-safe: TypeScript ensures correct payload structure
 * publishAuthEvent('auth:signed-in', {
 *   loginHint: 'user@example.com',
 *   accountId: 'abc123',
 *   appName: 'shell',
 *   clientId: 'client-id'
 * });
 * 
 * // Type error: Missing required fields
 * publishAuthEvent('auth:signed-in', { loginHint: 'user@example.com' });
 * ```
 */
export function publishAuthEvent<T extends AuthEventType>(
  type: T,
  payload: AuthEventData[T]
): void {
  const event: AuthEvent<T> = {
    type,
    timestamp: Date.now(),
    payload,
  };

  try {
    const channel = getChannel();
    channel.postMessage(event);
  } catch (error) {
    console.error('[AuthEventBus] Publish failed:', error);
  }
}

/**
 * Subscribe to auth events with optional filtering by event types
 * 
 * @example
 * ```typescript
 * // Subscribe to all events
 * const unsubscribe = subscribeToAuthEvents((event) => {
 *   if (event.type === 'auth:signed-in') {
 *     // TypeScript knows payload has loginHint, accountId, etc.
 *     console.log(event.payload.loginHint);
 *   }
 * });
 * 
 * // Subscribe to specific event types only
 * const unsubscribe = subscribeToAuthEvents(
 *   (event) => console.log(event),
 *   ['auth:signed-in', 'auth:signed-out']
 * );
 * 
 * // Cleanup
 * unsubscribe();
 * ```
 */
export function subscribeToAuthEvents(
  handler: AuthEventHandler,
  eventTypes?: AuthEventType[]
): UnsubscribeFn {
  const channel = getChannel();

  const listener = (event: MessageEvent) => {
    const data = event.data;

    if (!isAuthEvent(data)) {
      return;
    }

    if (eventTypes && !eventTypes.includes(data.type)) {
      return;
    }

    try {
      void handler(data);
    } catch (error) {
      console.error('[AuthEventBus] Handler error:', error);
    }
  };

  channel.addEventListener('message', listener);

  return () => {
    channel.removeEventListener('message', listener);
  };
}

export function closeAuthEventBus(): void {
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }
}
