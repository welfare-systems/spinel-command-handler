import * as fs from "fs";
import * as path from "path";
import { SpinelClient } from "../Client";
import { REST, Routes, Snowflake } from "discord.js";
import { SpinelCommand } from "../classes/Command";
const ALLOWED_EXTENSIONS = [".ts", ".js"];
export class CommandHandler {
  /**
   * The array of json information of the commands
   */
  public commands: any[] = [];

  /**
   * The Spinel CLient
   */
  public client: SpinelClient;

  /**
   * The directory of the slash commands
   */
  public directory: string;

  /**
   * The guild id in case of private registering commands
   */
  public guildId?: string;

  /**
   * Whether commands will be registered globally or not
   */
  public privateRegister: boolean;

  /**
   * The REST token
   */
  public token: string;

  public constructor(client: SpinelClient, options: CommandHandlerOptions) {
    this.client = client;
    this.directory = options.directory;
    this.guildId = options.guildId;
    this.token = options.token;
    this.privateRegister = options.privateRegister;

    this.setup();
  }

  private async getJsonCommands(directory: string): Promise<any[]> {
    const commandFolderNames = this.getCommandFolderNames(directory);

    for (const folder of commandFolderNames) {
      await this.processCommandFolder(directory, folder);
    }

    return this.commands;
  }

  private getCommandFolderNames(directory: string): string[] {
    return fs
      .readdirSync(directory)
      .filter((file) => ALLOWED_EXTENSIONS.some((ext) => file.endsWith(ext)));
  }

  private async processCommandFolder(
    directory: string,
    folder: string
  ): Promise<void> {
    const commandsPath = path.join(directory, folder);
    const commandFiles = fs.readdirSync(commandsPath);

    for (const file of commandFiles) {
      await this.processCommandFile(commandsPath, file);
    }
  }

  private async processCommandFile(
    commandsPath: string,
    file: string
  ): Promise<void> {
    const filePath = path.join(commandsPath, file);
    const { default: commandExport } = await import(filePath);

    if (
      typeof commandExport !== "object" ||
      !(commandExport.data instanceof SpinelCommand)
    ) {
      console.warn(`[WARNING] >> Invalid export in ${filePath}`);
      return;
    }

    this.client.SlashCommands.set(
      commandExport.getBuilder().name,
      commandExport
    );
    const command = commandExport.getBuilder().toJSON();
    this.commands.push(command);
  }

  private async registering(
    token: string,
    guildId: any = this.guildId
  ): Promise<void> {
    const rest = new REST().setToken(token);

    try {
      if (!this.client.user) {
        throw new Error("Client user is not defined.");
      }

      let data: any;
      if (this.privateRegister) {
        if (!guildId) {
          throw new Error(
            "Guild ID must be provided when privateRegister is true."
          );
        }
        data = await rest.put(
          Routes.applicationGuildCommands(
            this.client.user.id as Snowflake,
            guildId as Snowflake
          ),
          { body: this.commands }
        );
      } else {
        data = await rest.put(
          Routes.applicationCommands(this.client.user.id as Snowflake),
          { body: this.commands }
        );
      }

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  }

  protected setup() {
    this.getJsonCommands(this.directory);
    if (this.privateRegister) {
      this.registering(this.token, this.guildId);
    } else {
      this.registering(this.token);
    }

    this.client.on("interactionCreate", async (i) => {
      if (i.isCommand()) {
        const command: any = this.client.SlashCommands.get(i.commandName);
        if (!command) return;
        try {
          await command.execute(i);
        } catch (error) {
          console.error(error);
          i.reply({
            content: "There was an error while executing this command",
            ephemeral: true,
          });
        }
      }
    });
  }
}

export type CommandHandlerOptions = {
  directory: string;
  privateRegister: boolean;
  guildId?: string;
  token: string;
};
