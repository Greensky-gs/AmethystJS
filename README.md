<p align="center">
  <a href="X">
    <img src="https://github.com/Greensky-gs/AmethystJS/blob/master/logo.png" alt="Logo">
  </a>

<p align="center">
  <a href="https://discord.gg/NjsmxpnyXg">
    <img src="https://img.shields.io/discord/974703720380133457?color=5865F2&logo=discord&logoColor=white" alt="Discord Server">
  </a>
 <a href="https://www.npmjs.com/package/amethystjs">
    <img src="https://img.shields.io/npm/v/amethystjs" alt="Package NPM">
  </a>
 <a href="https://github.com/Greensky-gs/amethystjs/releases">
    <img src="https://img.shields.io/github/downloads/Greensky-gs/amethystjs/total" alt="Download">
</a>

## Installation

```yml
npm : npm install amethystjs
yarn : yarn add amethystjs
pnpm : pnpm add amethystjs
```

## Features

With this powerful framework you can :

* [Create commands](#create-a-command)
* [Handle errors](#handle-errors)
* [Create a precondition](#record-your-own-preconditions)
* [Use events](#registering-events)
* [Handle autocomplete interactions](#autocomplete-listeners)
* [Wait for messages](#wait-for-messages)
* [Wait for interactions](#wait-for-interactions)
* [Handle buttons](#button-handler)
* [Handle modals](#modal-handlers)
* [Make a control panel](#make-a-control-panel)
* [Set custom prefixes](#register-custom-prefixes)
* [Wait a little time](#wait)
* [Paginate embeds](#paginator)
* [log4js](#log4js)

See an example [right here](#examples)

## Create Amythyst Client

Import the client

```ts
import { AmethystClient } from 'amethystjs';

const client = new AmethystClient({
    // Discord.js client options
}, {
    token: process.env.token,
    debug: true,
    commandsFolder: './commands',
    buttonsFolder: './button',
    eventsFolder: './events',
    modalHandlersFolder: './modals',
    autocompleteListenersFolder: './autocompletes',
    preconditionsFolder: './preconditions',
    prefix: '!!',
    strictPrefix: false,
    botName: 'Amethyst',
    botNameWorksAsPrefix: true,
    mentionWorksAsPrefix: true,
    defaultCooldownTime: 10,
    waitForDefaultReplies: {
        user: ({ user, interaction }) => ({ content: "You cannot interact with this message" }),
        everyone: ({ user, interaction }) => ({ content: "You cannot interact with this message" })
    },
    commandsArchitecture: 'simple',
    eventsArchitecture: 'simple',
    commandLocalizationsUsedAsNames: true,
    defaultWhoCanReact: 'useronly',
    activity: {
       name: 'Amethyst',
       type: 'Playing',
       url: 'https://github.com/Greensky-gs/amethystjs'
    }
});
client.start({
    // All are optionnal and true by default
    loadCommands: true, // Load commands
    loadEvents: true, // Load events
    loadPreconditions: true, // Load preconditions
    loadAutocompleteListeners: true, // Load autocomplete listeners
    loadModals: true // Load modals handlers
});
```

## Create a command

Go in your commands folder, and create a new file.

### Architecture

The emplacement of the file depends of your architecture ( `commandsArchitecture`,  defined when [creating the client](#create-amythyst-client) )

If it is simple, it looks like this :

```cmd
|_commands
  |_info.ts/js
  |_ban.ts/js
```

If you configured it to double, it looks like this :

```cmd
|_commands
  |_moderation
    |_ban.ts/js
    |_info.ts/js
```

### Command creation

Import AmethystCommand and exports it

```ts
import { AmethystCommand } from 'amethystjs';

export default new AmethystCommands({
    name: 'command name', // Command name
    description: "Description of the command", // Description - required
    cooldown: 5, // Cooldown time
    permissions: [ 'Administrator' ], // Permissions for the user - optionnal
    clientPermissions: [ 'ManageChannels' ], // Permissions for the bot - optionnal
    preconditions: [  ], // Preconditions for the command - optionnal
    messageInputChannelTypes: [], // Channel types allowed for message input running - optionnal
    aliases: ['alias 1', 'alias 2', '...'], // Command aliases - optionnal
    messageInputDescription: "Description of the message command (optionnal)", // Message description - optionnal
    userContextName: "name of the user context command", // Name of the user context command - optionnal
    messageContextName: "Name of the message context command" // Name of the message context command - optionnal
})
.setMessageRun((options) => {
    // Write code for message commands (optionnal)
})
.setChatInputRun((options) => {
    // Write code for slash commands (optionnal)
}).setUserContextMenuRun((options) => {
    // Write code for user context menu command (optionnal)
})
.setMessageContextMenuRun((options) => {
    // Write code for message context menu command (optionnal)
})
```

## Handle errors

Use the `commandDenied` event to handle command denietions

Use the `commandError` event to handle command errors

## Record your own preconditions

Amethyst JS allows you to create your own preconditions (because it's fun 🙂)

First, import the Precondition from Amethyst

```ts
import { Precondition } from 'amethystjs';

export default new Precondition("Your precondition's name")
.setChatInputRun((options) => {
    // Run your precondition here for slash commands
    // You have to return something like this :
    return {
        ok: true,
        message: 'Message in case of fail',
        metadata: {/* some more datas */},
        interaction: options.interaction,
        type: 'chatInput'
    }
})
.setMessageRun((options) => {
    // Run your precondition here for message commands
    // Return something like this
    return {
        ok: true,
        message: "Message in case of fail",
        metadata: { /* some extra datas */ },
        type: 'message',
        channelMessage: options.message
    }
}).setModalRun((options) => {
    // Run your modal precondition here
    // Return something like so
    return {
        ok: true,
        message: "Message in case of fail",
        metadata: { /* some data here */ },
        type: 'modal',
        modal: options.modal
    }
}).setUserContextMenuRun((options) => {
    // Run your precondition for user context command here
    // Return something like this
    return {
        ok: true,
        message: "Message in case of fail",
        metadata: { /* Some more datas */ },
        type: 'userContextMenu',
        contextMenu: options.interaction
    }
}).setMessageContextMenuRun((options) => {
    // Run your precondition for message context command here
    // Return something like this
    return {
        ok: true,
        message: "Message in case of fail",
        metadata: { /* Some more datas */ },
        type: 'messageContextMenu',
        contextMenu: options.interaction
    }
})
```

To use a custom precondition in a command, use it like so :

```ts
import yourPrecondition from 'your precondition file';
import { AmethystCommand } from 'amethystjs';

export default new AmethystCommand({
    name: 'name',
    preconditions: [ yourPrecondition ]
})
```

## Registering events

Go in your events folder and add a new file

### Architecture of events

The emplacement of the file depends of your architecture ( `eventsArchitecture`, defined when [creating the client](#create-amythyst-client) )

If it is simple, it looks like this :

```cmd
|_events
  |_ready.ts/js
  |_commandDenied.ts/js
```

If you configured it to double, it looks like this :

```cmd
|_events
  |_bot
    |_ready.ts/js
    |_guildCreate.ts/js
  |_users
    |_commandDenied.ts/js
```

```ts
import { AmethystEvent } from 'amethystjs';

export default new AmethystEvent('eventName', (/* event options */) => {
    // Run your event
})
```

### Events list

Amethyst JS adds events to the Discord Client. Here is the list of the events you can resiter via [Events handler](#registering-events) :

| Event | When its activated | arguments list | Types |
| :-----|:------------------:|----------------| ----: |
| `amethystDebug` | When the client debugs something | message | [string](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) |
| `commandDenied` | When a precondition stops a command | command, reason | [commandDeniedPayload](./src/typings/Command.ts#L197), [deniedReason](./src/typings/Client.ts#L339) |
| `commandError` | When an error occurs | command, reason | [commandDeniedPayload](./src/typings/Command.ts#L197), [errorReason](./src/typings/Client.ts#L310) |
| `buttonInteraction` | When a button is pressed | interaction, message | [ButtonInteraction](https://old.discordjs.dev/#/docs/discord.js/main/class/ButtonInteraction), [Message](https://old.discordjs.dev/#/docs/discord.js/main/class/Message) |
| `modalSubmit` | When a modal interaction is created | interaction | [ModalSubmitInteraction](https://old.discordjs.dev/#/docs/discord.js/main/class/ModalSubmitInteraction) |
| `buttonDenied` | When a button is stopped because of a precondition | button | [buttonDenied](./src/typings/ButtonHandler.ts#L71) |
| `selectMenuInteraction` | When any select menu is interacted | selector | [AnySelectMenuInteraction](https://old.discordjs.dev/#/docs/discord.js/main/class/AnySelectMenuInteraction) |
| `stringSelectInteraction` | When a string select menu is interacted | selector | [StringSelectMenuInteraction](https://old.discordjs.dev/#/docs/discord.js/main/class/StringSelectMenuInteraction) |
| `roleSelectMenuInteraction` | When a role select menu is interacted | selector | [RoleSelectMenuInteraction](https://old.discordjs.dev/#/docs/discord.js/main/class/RoleSelectMenuInteraction) |
| `userSelectInteraction` | When an user select menu is interacted | selector | [UserSelectMenuInteraction](https://old.discordjs.dev/#/docs/discord.js/main/class/UserSelectMenuInteraction) |
| `channelSelectInteraction` | When a channel select menu is interacted | selector | [ChannelSelectMenuInteraction](https://old.discordjs.dev/#/docs/discord.js/main/class/ChannelSelectMenuInteraction) |
| `mentionableSelectInteraction` | When a mentionable select menu is interacted | selector | [MentionableSelectMenuInteraction](https://old.discordjs.dev/#/docs/discord.js/main/class/MentionableSelectMenuInteraction) |
| `modalRejected` | When a modal is stopped because of a precondition | reason | [ModalDenied](./src/typings/ModalHandler.ts#L63) |

## Autocomplete listeners

Autocomplete listeners are things that replies to an autocomplete interaction (interaction options with a lot of choices)

Go in your autocomplete listeners and create a new file

```ts
import { AutocompleteListener } from 'amethystjs';

export default new AutocompleteListener({
    commandName: [ { commandName: 'command name here' }, { commandName: 'another command name here', optionName: 'optionnal option name in the command here' } ],
    run: (options) => {
        // Make your choice here are return :
        return [ {name: 'Name', value: 'value', nameLocalizations: {} } ]
    }
});
```

As you've maybe noticed, `commandName` is an array containing a commandName and a potential optionName.

It means that the autocomplete will be applied to every command with the name included in the array, and if optionName is specified, it will also check if the option name correspond to the one specified.

## Button handler

Amethyst JS can handle button interactions for you.

Go to your buttons folder and create a new file

```ts
import { ButtonHandler } from 'amethystjs';

export default new ButtonHandler({
    customId: 'buttonCustomId',
    permissions: ['Permissions required for the user'],
    clientPermissions: ["Permissions required for the client"],
    identifiers: [ 'optionnal array of more button custom identifiers' ]
})
.setRun((options) => {
    // Execute your code here
})
```

If you specify permissions, you have to handle it in case of error.

> The customId and identifiers propreties are button custom ID

To handle it, [create a new event](#registering-events) and record for the `buttonDenied` event.

## Wait for messages

You can wait for messages using amethyst JS.

You'll use `waitForMessage()` function.

```ts
import { waitForMessage } from 'amethystjs';

// Important : this works only in an async function
// For exemple, I'll do a simple client.on('messageCreate') to show you how to use it
client.on('messageCreate', async(message) => {
    if (message.content === '!ping') {
        await message.channel.send(`Would you like me to reply ?\nReply by \`yes\` or \`no\``);
        const reply = await waitForMessage({
            user: message.author,
            whoCanReact: 'useronly',
            channel: message.channel,
            time: 120000
        });

        if (!reply) message.channel.send(`You haven't replied :/`);
        if (reply.content === 'yes') message.reply("Pong !");
    }
})
```

## Wait for interactions

Amethyst JS allows you to wait for interaction responses, like a select menu or a button click

```ts
import { waitForInteraction } from 'amethystjs';
import { ButtonBuilder, ActionRowBuilder, componentType, Message } from 'discord.js';

// This function works only in an async function.
// Here i'm gonna show you in a very simple async function.
// In this exemple, interaction is already defined

(async() => {
    const msg = await interaction.reply({
        message: "Yes or no",
        components: [ new ActionRowBuilder({
            components: [
                new ButtonBuilder({ label: 'Yes', style: ButtonStyle.Success, customId: 'yes' }),
                new ButtonBuilder({ label: 'No', style: ButtonStyle.Danger, customId: 'no' })
            ]
        }) as ActionRowBuilder<ButtonBuilder>]
    }) as Message<true>;

    const reply = await waitForInteraction({
        message: msg,
        time: 120000,
        whoCanReact = 'useronly',
        user: interaction.user,
        componentType: componentType.Button
    });

    if (!reply || reply.customId === 'no') return interaction.editReply("Ok, no");
    interaction.editReply("Yes !");
})()
```

## Register custom prefixes

The [Amethyst client](#create-amythyst-client) has a `prefixesManager` proprety that allows you to set different prefixes for different servers

:warning: **Important** The client **does not** save the prefixes, you have to use a **database** to save it for your bot. The manager register prefixes only to use it with Amethyst client

### Summary

Here is the summary of the [prefixes manager](#register-custom-prefixes)

| Proprety | Type |
|----------|------|
| [`setPrefix`](#setprefix) | Method |
| [`getPrefix`](#getprefix) | Method |
| [`samePrefix`](#same-prefix) | Method |
| [`list`](#prefixes-list) | Proprety |
| [`json`](#prefixes-json) | Proprety |

#### setPrefix

Set a prefix for a server.

:warning: Use it when you load your bot, in a ready [event](#registering-events), for example.

```js
const prefixes = [
    { guildId: '1324', prefix: '!' },
    { guildId: '4321', prefix: '!!' },
    { guildId: '1324', prefix: '??' }
];

for (const data of prefixes) {
    client.prefixesManager.setPrefix({
        guildId: data.guildId,
        prefix: data.prefix
    });
}
```

#### getPrefix

Get the custom prefix of a server.

Returns default prefix if the server has no custom prefix

```js
client.prefixesManager.getPrefix('guild ID')
```

#### Same prefix

Return all the servers with the same prefix

The method returns an array of objects with 2 propreties :

```ts
{
    guildId: string;
    prefix: string
}
```

```js
client.prefixesManager.samePrefix('!')
```

#### prefixes list

You can get the prefixes data to manage it if you want.

This method will return a [map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/map). If you want to get it as an array, use [json method](#prefixes-json) instead

The map has 2 propreties :

```ts
Map<
    string, // Corresponding to the guild ID
    string // Corresponding to the prefix
>
```

```js
client.prefixesManager.list;
```

#### Prefixes json

You can get the prefixes data to manage it if you want.

This method will return an array. Use [map method](#prefixes-list) to get it as a map if you need.

The array has 2 propreties :

```ts
{
    guildId: string;
    prefix: string;
}[];
```

```js
client.prefixesManager.json;
```

## Wait

You can wait for a certain time before executing something else with Amethyst JS. Here is how to use the wait method

```ts
// Import wait
import { wait } from 'amethystjs'

// Use it in an async function, it wont work otherwise
(async() => {
    await wait(1000); // Wait 1s
    await wait(1, 's'); // Wait 1s
    await wait(1, 'm'); // Wait 1 minute
})();
```

## Modal Handlers

You can use modal handlers with Amethyst JS, it can handle modals trought an object inside the modals handler folder

```ts
import { ModalHandler } from 'amethystjs';

export default new ModalHandler({
    modalId: ['identifiers of modals to be handled'],
    name: "Name of the handler"
}).setRun((opts) => {
    opts.modal;
    opts.user;
});
```

## Make a control panel

You can make a control panel for your bot

![image](https://media.discordapp.net/attachments/1012743337754771486/1146382088434630696/image.png?width=2052&height=636)

You need to have the [client](#create-amythyst-client) created

### Creation

Here's how to create a control panel

```ts
import { AmethystClient, ControlPanel } from 'amethystjs';
import rebootHandler from './buttons/reboot';
import const { panelEmbed }  from './contents/embeds';

const client = new AmethystClient({
    intents: ['Guilds']
}, {
    token: 'token',
    debug: true,
    buttonsFolder: './dist/buttons'
})

client.start({}) // You can start it after the panel is created if you want

const panel = new ControlPanel({
    client: client,
    channelID: 'Id of the channel where the panel will be',
    deleteMessages: true, // Delete the other messages in the channel - optional
    pin: true, // Pin the panel - optional
    content: { 
        content: "Control panel",
        embeds: [panelEmbed]
    } // Content of the message - optional
});
```

### Register a button

Now you surely want to register your buttons

```ts
import rebootHandler from './buttons/reboot';

panel.registerButton({
    label: 'Disconnect voice',
    handler: 'panel.disconnect', // Use the handler that handles 'panel.disconnect'
    style: 'Primary'
})
.registerButton({
    label: 'Reboot',
    style: 'Danger',
    handler: rebootHandler // Use the imported handler
})
```

Once it's done, don't forget to start the panel with `panel.start()` method

## Log4JS

Amethyst JS allows you to log things in a log file with `log4js`

This object has two methods

### Trace

The `trace()` method allows you to write something in the log file

```js
const { log4js } = require('amethystjs');

log4js.trace("Something just happened");
```

### Config

The `config()` method configs log4js.

For now, you can config :

* Trigger the time displaying
* Time displaying format
* log file
* Add a `onLog` event
* Object indentation

```js
const { log4js } = require('amethystjs');

log4js.config('displayTime', true);
log4js.config('onLog', (message) => {
    console.log(`Log4JS traced something`)
})
log4js.config('file', 'logs.txt')
log4js.config('objectIndentation', 1)
log4js.config('displayTimeFormat', (time) => `[${time.getDay()}/${time.getMonth()}/${time.getFullYear()}:${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`)
```

## Paginator

The [Greensky's paginator](https://npmjs.com/package/dsc-pagination) under the name of `AmethystPaginator`. The method is the exact same than the package.

## Examples

Here are some repositories that use Amethyst JS :

* [Lofi Girl](https://github.com/Greensky-gs/lofi-girl) by [Greensky](https://github.com/Greensky-gs/) (Amethyst JS v1.7.1)
* [Draver Bot](https://github.com/DraverBot/DraverBot) by [Draver Industries](https://github.com/DraverBot) (Amethyst JS v1.7.2)

# Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the documentation.

<a href="https://github.com/Greensky-gs/AmethystJS/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Greensky-gs/AmethystJS" />
</a>
