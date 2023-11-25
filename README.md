![Spinel Framework](https://cdn.discordapp.com/attachments/1128107427473149994/1177763501511561327/image.png?ex=6573b0bc&is=65613bbc&hm=62387480592fcbe6cabffcec486ad85982a59edd58407ad072b1e978f642c872&)

# Spinel Framework

A beginner-friendly framework written in TypeScript and Discord.JS

## Features

- Built-in TypeScript Declarations
- Open-source
- Handlers
- Slash Commands
- Latest Discord.JS support
- TypeScript - JavaScript support
- Modular
- Completely customizable
- Constant updates

## Installation

```bash
  npm install @welfare-systems/spinel-framework
  yarn add @welfare-systems/spinel-framework
  pnpm add @welfare-systems/spinel-framework
  bun add @welfare-systems/spinel-framework
```

## Usage/Examples

Creating a client instance:

```ts
import { SpinelClient } from "@welfare-systems/spinel-framework";

const client = new SpinelClient({
  commandHandlerOptions: {
    directory: "./commands", // The directory where your slash command files are located
    privateRegister: true, // This means the commands will be registered to a specific guild
    guildId: "1234567890", // The ID of the guild where the commands will be registered (Not needed when registering globally)
    token: "your-discord-bot-token", // Your Discord bot token to use REST api
  },
  listenerHandlerOptions: {
    directory: "./listeners", //The directory where your listener files are located
  },
  intents: ["GUILDS", "GUILD_MESSAGES"], // Add more intents as needed
  // ... You can also add all the Discord.Client options
});

client
  .login("your-discord-bot-token")
  .then(() => console.log("Bot is successfully logged in"))
  .catch(console.error);
```

Making a basic command:

```ts
import { SpinelCommand } from "@welfare-systems/spinel-framework";

export class ExampleCommand extends SpinelCommand {
  constructor() {
    super("example", "An example command");
    this.data
      .addStringOption((option) =>
        option.setName("input").setDescription("Input value").setRequired(true)
      )
      .addIntegerOption((option) =>
        option.setName("amount").setDescription("Amount").setRequired(false)
      );
  }

  async exec(interaction: CommandInteraction): Promise<void> {
    // Your command execution logic here
  }
}
```

Making a basic listener:

```ts
import { Listener } from "@welfare-systems/spinel-framework";

export class MyListener extends Listener {
  public constructor(options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
      event: "ready",
      emitter: "myEmitter",
    });
  }
}
```
