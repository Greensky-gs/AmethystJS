
# AmethystJS

A complete framework for Discord.js v14 in TypeScript

## Features

With this powerful framework you can :

* [Create commands](#create-a-command)
* [Handle errors](#handle-errors)

## Create Amythyst Client

Import the client

```ts
import { AmethystClient } from 'amethyst';

const client = new AmethystClient({
    // Discord client options
}, {
    // Amethyst client options
});
client.start(/* Amethyst start options */);
```

```js
const { AmethystClient } = require('amethyst');

const client = new AmethystClient({
    // Discord client options
}, {
    // Amethyst client options
});
client.start(/* Amethyst start options */);
```

## Create a command

Go in your commands folder, and create a new file.

Import AmethystCommand and exports it

```ts
import { AmethystCommand } from 'amethystjs';

export default new AmethystCommands({
    name: 'name',
    preconditions: ['Your preconditions'],
    cooldown: 'Cooldown',
    options: [
        // Slash command options
    ],
    description: "Description"
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
    name: 'name',
    preconditions: ['Your preconditions'],
    cooldown: 'Cooldown',
    options: [
        // Slash command options
    ],
    description: "Description"
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