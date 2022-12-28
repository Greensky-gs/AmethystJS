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

* yarn : `yarn add amethystjs`
* pnpm : `pnpm add amethystjs`
* npm : `npm install amethystjs`

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
* [Set custom prefixes](#register-custom-prefixes)

See an example [right here](#examples)

## Requests

You can request any feature by [opening an issue](https://github.com/Greensky-gs/AmethystJS/issues/new). If I can, I'll made it.

## Create Amythyst Client

Import the client

```ts
import { AmethystClient } from 'amethyst';

const client = new AmethystClient({
    // Discord.js client options
}, {
    botName: "your bot's name", // Optionnal
    botNameWorksAsPrefix: true, // Wether if we can use the bot's name as prefix - optionnal
    commandsFolder: './yourCommandsFolder', // Optionnal
    eventsFolder: './yourEventsFolder', // Optionnal
    prefix: "bot's prefix", // Optionnal
    strictPrefix: true, // Wether if the prefix must be exactly the same - optionnal
    mentionWorksAsPrefix: true, // Wether if we can use the bot by mentionning it
    token: "Your bot's token",
    debug: false, // Enable debug mode (get a lot of messages in the console) - optionnal
    defaultCooldownTime: 5, // Default cooldown time
    preconditionsFolder: "./yourPreconditionsFolder", // Specify the preconditions folder - optionnal
    autocompleteListenersFolder: "./autocompleteListenersFolder", // Specify the autocomplete folder - optionnal
    buttonsFolder: './buttonsFolder', // Specify the button folder for button handlers - optionnal
    customPrefixAndDefaultAvailable?: true // Specify if the default prefix is usable when a custom prefix is set - optionnal
});
client.start({
    // All are optionnal
    loadCommands: true, // Load commands
    loadEvents: true, // Load events
    loadPreconditions: true, // Load preconditions
    loadAutocompleteListeners: true // Load autocomplete listeners
});
```

```js
const { AmethystClient } = require('amethyst');

const client = new AmethystClient({
    // Discord.js client options
}, {
    botName: "your bot's name", // Optionnal
    botNameWorksAsPrefix: true, // Wether if we can use the bot's name as prefix - optionnal
    commandsFolder: './yourCommandsFolder', // Optionnal
    eventsFolder: './yourEventsFolder', // Optionnal
    prefix: "bot's prefix", // Optionnal
    strictPrefix: true, // Wether if the prefix must be exactly the same - optionnal
    mentionWorksAsPrefix: true, // Wether if we can use the bot by mentionning it
    token: "Your bot's token",
    debug: false, // Enable debug mode (get a lot of messages in the console) - optionnal
    defaultCooldownTime: 5, // Default cooldown time
    preconditionsFolder: "./yourPreconditionsFolder", // Specify the preconditions folder - optionnal
    autocompleteListenersFolder: "./autocompleteListenersFolder", // Specify the autocomplete folder - optionnal
    buttonsFolder: './buttonsFolder', // Specify the button folder for button handlers - optionnal
    customPrefixAndDefaultAvailable?: true // Specify if the default prefix is usable when a custom prefix is set - optionnal
});
client.start({
    // All are optionnal
    loadCommands: true, // Load commands
    loadEvents: true, // Load events
    loadPreconditions: true, // Load preconditions
    loadAutocompleteListeners: true // Load autocomplete listeners
});
```

## Create a command

Go in your commands folder, and create a new file.

Import AmethystCommand and exports it

```ts
import { AmethystCommand } from 'amethystjs';

export default new AmethystCommands({
    cooldown: 5, // Cooldown time
    name: 'command name', // Command name
    permissions: [ 'Administrator' ], // Permissions for the user - optionnal
    clientPermissions: [ 'ManageChannels' ], // Permissions for the bot - optionnal
    preconditions: [  ], // Preconditions for the command - optionnal
    messageInputChannelTypes: [], // Channel types allowed for message input running - optionnal
    aliases: ['alias 1', 'alias 2', '...'] // Command aliases - optionnal
})
.setMessageRun((options) => {
    // Write code for message commands (optionnal)
})
.setChatInputRun((options) => {
    // Write code for slash commands (optionnal)
})
```

```js
const { Amethystcommand } = require('amethystjs');

module.exports = new AmethystCommands({
    cooldown: 5, // Cooldown time
    name: 'command name', // Command name
    permissions: [ 'Administrator' ], // Permissions for the user - optionnal
    clientPermissions: [ 'ManageChannels' ], // Permissions for the bot - optionnal
    preconditions: [  ], // Preconditions for the command - optionnal
    messageInputChannelTypes: [], // Channel types allowed for message input running - optionnal
    aliases: ['alias 1', 'alias 2', '...'] // Command aliases - optionnal
})
.setMessageRun((options) => {
    // Write code for message commands (optionnal)
})
.setChatInputRun((options) => {
    // Write code for slash commands (optionnal)
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
        isChatInput: true
    }
})
.setMessageRun((options) => {
    // Run your precondition here for message commands
    // Return something like this
    return {
        ok: true,
        message: "Message in case of fail",
        metadata: { /* some extra datas */ },
        isChatInput: false,
        channelMessage: options.message
    }
})
```

```js
const { Precondition } = require('amethystjs');

module.exports = new Precondition("Your precondition's name")
.setChatInputRun((options) => {
    // Run your precondition here for slash commands
    // You have to return something like this :
    return {
        ok: true,
        message: 'Message in case of fail',
        metadata: {/* some more datas */},
        interaction: options.interaction,
        isChatInput: true
    }
})
.setMessageRun((options) => {
    // Run your precondition here for message commands
    // Return something like this
    return {
        ok: true,
        message: "Message in case of fail",
        metadata: { /* some extra datas */ },
        isChatInput: false,
        channelMessage: options.message
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

```js
const precondition = require('your precondition file');
const { AmethystCommand } = require('amethystjs');

module.exports = new AmethystCommand({
    name: 'name',
    preconditions: [ precondition ]
});
```

## Registering events

Go in your events folder and add a new file

```ts
import { AmethystEvent } from 'amethystjs';

export default new AmethystEvent('eventName', (/* event options */) => {
    // Run your event
})
```

```js
const { AmethytsEvent } = require('amethystjs');

module.exports = new AmethystEvent('eventName',/* event options */ () => {
    // Run your event
})
```

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

```js
const { AutocompleteListener } = require('amethystjs');

module.exports = new AutocompleteListener({
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

> In case you don't know, some events have been added to the client : `buttonInteraction`, `modalSubmit` and events for each select menu interaction ( string, role, user, channel, mentionable and any )

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

```js
const { ButtonHandler } = require('amethystjs');

module.exports = new ButtonHandler({
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

```js
const { waitForMessage } = require('amethystjs');

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

```js
const { waitForInteraction } = require('amethystjs');
const { ActionRowBuilder, ButtonBuilder, componentType } = require('discord.js');

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
        }) ]
    })

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
|-|-|
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

## Examples

Here are some repositories that use Amethyst JS :

* [Lofi Girl](https://github.com/Greensky-gs/lofi-girl) (Amethyst JS v1.2.4)

# Contributors

<a href="https://github.com/Greensky-gs/AmethystJS/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Greensky-gs/AmethystJS" />
</a>
