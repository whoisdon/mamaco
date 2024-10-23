![](https://i.imgur.com/Jzwv76o.png)

<h1 align="center"> 
	Mamaco Source
</h1>

> Have you ever thought about bringing the perfect balance of moderation and fun to your Discord server? Well, look no further! With Mamaco constantly evolving, your daily tasks will be effortlessly managed, freeing you to dive into endless possibilities and unleash your creativity.

Mastering this bot is like unlocking hidden powers that reveal the full potential of discord.js, allowing you to craft custom solutions and make your server’s experience truly unique.

The magic of Mamaco lies in the use of the discord.js framework, which breathes life into bots and lets you embark on a real adventure in the world of Discord. Imagine it as a treasure chest filled with tools to create enchanted servers, magical channels, and mysterious messages. With powerful methods and events at your fingertips, you can perform wonders and fulfill the wishes of your users.

#### [Read the docs →](https://discord.js.org/#/)

## Settings
Within the `.env` file, we will store a few variables:

```plaintext
TOKEN=
```
To set up your application, follow these steps: Locate the `.env.example` file in your project repository. Rename the file from `.env.example` to `.env`. In the `.env` file, you'll find a line similar to this:

```plaintext
TOKEN=
```
After the equal sign (=), paste your Discord bot token. It should look like this:
```plaintext
TOKEN=your_bot_token_here
```
Save the `.env` file.

Now, your application is configured to use the Discord bot token you've provided in the `.env` file. Remember to keep this file secure and never share your token with anyone else.

## Installing Dependencies

To get started with this project, you'll need to install its dependencies. You can choose your preferred package manager from the options below.

```bash
# with npm (recommended)
npm install

# with pnpm
pnpm install

# with yarn
yarn install

# with yarn
bun install
```
Feel free to customize the installations according to your preferences.

## Start Project

You can easily start the project by directly using the command
```bash
node .
```
I personally recommend giving [bun](https://github.com/oven-sh/bun) a whirl to kickstart your project - it's a shiny, new tech.
```bash
# with npm
npm install -g bun
```
To kickstart the project:
```plaintext
bun run index.js
```
## Structure
<details>
  <summary>Example of implementing slash (/) commands in Discord using the SlashCommandBuilder class as a foundation.</summary>
  
```js
import SlashCommands from '../../Structure/SlashCommands.js';
import { SlashCommandBuilder } from 'discord.js';

export default class extends SlashCommands {
  constructor(client) {
    super(client, {
      data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('.')  
    });
  }

  run = (interaction) => {

  }
}
```
#### Example
```
/
|-- src
|   |-- SlashCommands
|       |-- Administrator
|           |-- SetCommand.js
```
</details>
<details>
  <summary>Example of implementing prefix commands in Discord using the PrefixCommand class as a foundation.</summary>

```js
import PrefixCommands from '../../Structure/PrefixCommands.js';

export default class extends PrefixCommands {
    constructor(client) {
        super(client, {
            name: 'test',
            aliases: ['testing']
        });
    }
    run = (message, args) => {

    }
}
```
#### Example
```
/
|-- src
|   |-- PrefixCommands
|       |-- Geral
|           |-- DefaultCommand.js
```
</details>
<details>
  <summary>Example of implementing Discord.js events using the EventMap class as a foundation.</summary>
  
```js
import EventMap from '../../Structure/EventMap.js';

export default class extends EventMap {
  constructor(client) {
    super(client, {
      name: 'ready' // event name
    });
  }
  run = () => {

  }
}
```
#### Example
```
/
|-- src
|   |-- Events
|       |-- Client
|           |-- ReadyEvent.js
```
</details>

## License

This project is licensed under the Apache License. Please refer to the  [LICENSE](LICENSE) for details.
