import { Client, ClientOptions, Collection } from "discord.js";
import { CommandHandler } from "./handlers/CommandHandler";
import { ListenerHandler } from "./handlers/ListenerHandler";

import type { CommandHandlerOptions } from "./handlers/CommandHandler";
import type { ListenerHandlerOptions } from "./handlers/ListenerHandler";

export interface SpinelClientOptions {
  commandHandlerOptions: CommandHandlerOptions;
  listenerHandlerOptions: ListenerHandlerOptions;
}

export class SpinelClient<
  Ready extends boolean = boolean
> extends Client<Ready> {
  /**
   * The SlashCommands Collection
   * @since 1.0.0
   */
  public readonly SlashCommands: Collection<unknown, unknown> =
    new Collection();

  public constructor(options: ClientOptions) {
    super(options);
  }

  public override async login(token?: string) {
    if (this.options.commandHandlerOptions.privateRegister) {
      await new CommandHandler(this, {
        directory: this.options.commandHandlerOptions.directory,
        token: this.options.commandHandlerOptions.token,
        privateRegister: true,
      });
    } else {
      await new CommandHandler(this, {
        directory: this.options.commandHandlerOptions.directory,
        token: this.options.commandHandlerOptions.token,
        privateRegister: false,
      });
    }

    await new ListenerHandler(this, {
      directory: this.options.listenerHandlerOptions.directory,
    });

    return await super.login(token);
  }
}

declare module "discord.js" {
  interface ClientOptions extends SpinelClientOptions {}
}
