import { Client, ClientOptions, Collection } from "discord.js";
import { CommandHandler } from "./handlers/CommandHandler";

import type { CommandHandlerOptions } from "./handlers/CommandHandler";

export interface SpinelClientOptions {
  commandHandlerOptions: CommandHandlerOptions;
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
        clientId: this.options.commandHandlerOptions.clientId,
        guildId: this.options.commandHandlerOptions.guildId,
      });
    } else {
      await new CommandHandler(this, {
        directory: this.options.commandHandlerOptions.directory,
        token: this.options.commandHandlerOptions.token,
        privateRegister: false,
        clientId: this.options.commandHandlerOptions.clientId,
      });
    }

    return await super.login(token);
  }
}

declare module "discord.js" {
  interface ClientOptions extends SpinelClientOptions {}
}
