import { ClientEvents } from "discord.js";
import { EventEmitter } from "events";

export abstract class Listener<
  E extends keyof ClientEvents | symbol,
  Options extends Listener.Options = Listener.Options
> {
  /**
   * The emitter
   * @since 1.0.0
   */
  public readonly emitter: string | EventEmitter;

  /**
   * The name of the event
   * @since 1.0.0
   */
  public readonly event: string | symbol;

  /**
   * The Listener Type
   * @since 1.0.0
   */
  public readonly once: boolean;

  public constructor(options: Options = {} as Options) {
    this.emitter = options.emitter;
    this.event = options.event;
    this.once = options.once ?? false;
  }

  public abstract run(
    ...args: E extends keyof ClientEvents ? ClientEvents[E] : unknown[]
  ): unknown;
}

export type ListenerOptions = {
  readonly emitter: string | EventEmitter;
  readonly event: string | symbol;
  readonly once: boolean;
};

export namespace Listener {
  export type Options = ListenerOptions;
}
