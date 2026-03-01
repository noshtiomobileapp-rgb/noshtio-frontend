declare module "scheduler/tracing" {
  export interface Interaction {
    id: number;
    name: string;
    timestamp: number;
  }

  export type Subscriber = (interaction: Interaction) => void;

  export function unstable_clear(callback: () => void): void;
  export function unstable_getCurrent(): Set<Interaction>;
  export function unstable_subscribe(subscriber: Subscriber): void;
  export function unstable_trace(
    name: string,
    timestamp: number,
    callback: () => void
  ): void;
  export function unstable_unsubscribe(subscriber: Subscriber): void;
  export function unstable_wrap<T extends (...args: any[]) => any>(
    callback: T
  ): T;
}
