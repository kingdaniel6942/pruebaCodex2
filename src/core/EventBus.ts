export type EventHandler<T> = (payload: T) => void;

export class EventBus<Events extends Record<string, unknown>> {
  private handlers = new Map<keyof Events, Set<EventHandler<Events[keyof Events]>>>();

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    const bucket = this.handlers.get(event) ?? new Set();
    bucket.add(handler as EventHandler<Events[keyof Events]>);
    this.handlers.set(event, bucket);

    return () => {
      bucket.delete(handler as EventHandler<Events[keyof Events]>);
    };
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    const bucket = this.handlers.get(event);
    if (!bucket) return;
    bucket.forEach((handler) => handler(payload));
  }

  clear() {
    this.handlers.clear();
  }
}
