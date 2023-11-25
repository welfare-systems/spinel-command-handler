import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export abstract class SpinelCommand {
  /**
   * The data of the Slash Command Builder
   * @since 1.0.0
   */
  protected data: SlashCommandBuilder;

  constructor(name: string, description: string) {
    this.data = new SlashCommandBuilder()
      .setName(name)
      .setDescription(description);
  }

  public getBuilder(): SlashCommandBuilder {
    return this.data;
  }

  abstract exec(interaction: CommandInteraction): Promise<void>;

  protected handleError(error: Error): void {
    console.error(`Error executing command:`, error);
  }
}
