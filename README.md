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

## Create Amythyst Client

Import the client

```ts
import { AmethystClient } from 'amethyst';

const client = new AmethystClient({
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
}, {
    // Amethyst client options
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
}, {
    // Amethyst client options
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
    commandName: 'slash command name',
    run: (options) => {
        // Make your choice here are return :
        return [ {name: 'Name', value: 'value', nameLocalizations: {} } ]
    }
});
```

```js
const { AutocompleteListener } = require('amethystjs');

module.exports = new AutocompleteListener({
    commandName: 'slash command name',
    run: (options) => {
        // Make your choice here are return :
        return [ {name: 'Name', value: 'value', nameLocalizations: {} } ]
        
    }
});
```

# Contributors

<a href="https://github.com/Greensky-gs/AmethystJS/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Greensky-gs/AmethystJS" />
</a>
