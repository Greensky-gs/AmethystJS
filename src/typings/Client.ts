import {
    ChannelType,
    InteractionReplyOptions,
    Message,
    MessageComponentType,
    PermissionsString,
    TextChannel,
    User
} from 'discord.js';

type pathLike = `./${string}`;

export type AmethystClientOptions = {
    /**
     * Name of the bot
     *
     * @default `undefined`
     */
    botName?: string;
    /**
     * Defines if the bot's name can work as a prefix for message commands
     * If `<#AmethystClient>.botName` is null, this proprety has no effect
     *
     * @default `false`
     */
    botNameWorksAsPrefix?: boolean;
    /**
     * Defines the commands folder for the client
     * This folder is the folder where you will put every commands
     *
     * If your folder is called `./src/commands`, and that your project will be compiled in a `./dist` folder, put:
     * ```js
     * new AmethystClient({}, {
     *     commandsFolder: './dist/commands'
     * })
     * ```
     * @default `undefined`
     */
    commandsFolder?: pathLike;
    /**
     * Defines the events folder for the client
     * This folder is the folder where you will put every event
     *
     * If your folder is called `./src/events`, and that your project will be compiled in a `./dist` folder, put:
     * ```js
     * new AmethystClient({], {
     *     eventsFolder: './dist/events'
     * })
     * ```
     *
     * @default `undefined`
     */
    eventsFolder?: pathLike;
    /**
     * Prefix for the message commands
     *
     * ```js
     * new AmethystClient({}, {
     *     prefix: '!!'
     * });
     * ```
     * @default `undefined``
     */
    prefix?: string;
    /**
     * Defines if the prefix has to be exactly the same, at the capital letter exactly
     * @example If the prefix is `a!`, and that a user inputs `A!`, `strictPrefix` will say if `A!` is accepted if not strict
     *
     * @default `false`
     */
    strictPrefix?: boolean;
    /**
     * Defines if the mention of the bot can be used as a prefix
     *
     * @default `false`
     */
    mentionWorksAsPrefix?: boolean;
    /**
     * Token of the bot
     * @emits `ready` event of `Client` from `discord.js`
     */
    token: string;
    /**
     * Defines if logs have to be displayed in the console screen
     *
     * @default `false`
     */
    debug?: boolean;
    /**
     * Defines the default cooldown time for the commands
     * Time in seconds
     *
     * @default 5
     */
    defaultCooldownTime?: number;
    /**
     * Folder for your preconditions
     * The client will fetch every preconditions in this folder
     *
     * If your preconditions are in a folder called `./src/preconditions` and that your project will be compiled in a `./dist` folder, put:
     * ```js
     * new AmethystClient({}, {
     *     preconditionsFolder: './dist/preconditions'
     * });
     * ```
     * @default `undefined`
     */
    preconditionsFolder?: pathLike;
    /**
     * Folder for your autocomplete listeners
     * Autocomplete listeners are structures that completes autocomplete slash command options
     *
     * The client will fetch every autocompletes in this folder
     *
     * If your autocompletes are in a folder called `./src/autocompletes` and that your project will be compiled in a `./dist` folder, put:
     * ```js
     * new AmethystClient({}, {
     *     autcompleteListenersFolder: './dist/autocompletes'
     * });
     * ```
     * @default `undefined`
     */
    autocompleteListenersFolder?: pathLike;
    /**
     * Default replies for the `waitForInteraction()` method of AmethystJS
     *
     * @default `{ user: "You're not allowed to interact with this message", everyone: "You're not allowed to interact with this message" }`
     */
    waitForDefaultReplies?: {
        /**
         * Default reply when the user that can't reply interacts
         *
         * @default `"You're not allowed to interact with this message"`
         */
        user?: string;
        /**
         * Default reply when any user that can't reply interacts
         *
         * @default `"You're not allowed to interact with this message"`
         */
        everyone?: string;
    };
    /**
     * Folder for your button handlers
     * The client will fetch every button handler in this folder
     * 
     * If your button handlers are in a folder called `./src/buttons` and that your project will be compiled in a `./dist` folder, put:
     * ```js
     * new AmethystClient({}, {
     *     buttonsFolder: './dist/buttons'
w     * });
     * ```
     * @default `undefined`
     */
    buttonsFolder?: pathLike;
    /**
     * Folder for your modal handlers
     * The client will fetch every modal handlers in this folder
     *
     * If your modal handlers are in a folder called `./src/modals` and that your project will be compiled in a `./dist` folder, put:
     * ```js
     * new AmethystClient({}, {
     *     modalHandlersFolder: './dist/modals'
     * });
     * ```
     * @default `undefined`
     */
    modalHandlersFolder?: pathLike;
    /**
     * Defines if, when a server has a custom prefix by the `prefixesManager`, if the default prefix can be used instead of the custom one.
     *
     * If value set to `false`, only the custom prefix is available
     *
     * @default `true`
     */
    customPrefixAndDefaultAvailable?: boolean;
    /**
     * Trigger the colors on the debug interface
     *
     * @default `icon`
     */
    debuggerColors?: 'none' | 'icon' | 'line';
};
export type startOptions = {
    /**
     * Load commands from commands folder
     *
     * @default `true`
     */
    loadCommands?: boolean;
    /**
     * Load events from events folder
     *
     * @default `true`
     */
    loadEvents?: boolean;
    /**
     * Load preconditions from preconditions folder
     *
     * @default `true`
     */
    loadPreconditions?: boolean;
    /**
     * Load autocomplete listeners from autocompletes folder
     *
     * @default `true`
     */
    loadAutocompleteListeners?: boolean;
    /**
     * Load button handlers from buttons folder
     *
     * @default `true`
     */
    loadButtons?: boolean;
    /**
     * Load modal handlers from modals folder
     *
     * @default `true`
     */
    loadModals?: boolean;
};
/**
 * Command type
 *
 * If value is `message`, it's a message input command
 * If value is `chatInput`, it's a slash command
 */
export type CommandType = 'message' | 'chatInput';
export enum DebugImportance {
    Information = '*',
    Warning = '!',
    Critical = '!!',
    NotUnderstand = '?',
    Unexpected = '??',
    Error = '#'
}
export enum commandDeniedCode {
    /**
     * Command can be executed only in direct messages
     */
    DMOnly = 'DM only',
    /**
     * Command has ben executed in an invalid channel type.
     * Channel types are defined in the `messageInputChannelTypes` from the `AmethystCommand` constructor
     */
    InvalidChannelType = 'Invalid channel type',
    /**
     * Command can be executed only by the owner of the server
     */
    OwnerOnly = 'Owner only',
    /**
     * Command can be executed only in a server
     */
    GuildOnly = 'Guild only',
    /**
     * The user that used this command has a cooldown on this command
     */
    UnderCooldown = 'under cooldown',
    /**
     * Command has been denied by a custom precondition from the developper
     */
    CustomPrecondition = 'Custom precondition failure',
    /**
     * Client is missing permissions in the server
     */
    ClientMissingPerms = 'Client has not permissions',
    /**
     * User that used the command is missing permissions in the server
     */
    UserMissingPerms = 'Member missing permissions',
    /**
     * The channel type is undeterminable, so the command has been denied
     */
    UnknownChannelType = 'Could not determine channel type',
    /**
     * Command can be executed only in an NSFW channel
     */
    ChannelNotNsfw = 'Channel is not NSFW'
}
export enum errorCode {
    /**
     * This command is unknown to the Client
     */
    UnknownChatInputCommand = 'Unknown chat input command',
    /**
     * ChatInputRun has not been set
     */
    NoChatInputRun = 'No chat input run',
    /**
     * Message run has not been set
     */
    NoMessageRun = 'No message run',
    /**
     * User context command is unknown to the Client
     */
    UnknownUserContextCommand = 'Unknown user context menu command',
    /**
     * User context command has not been set
     */
    NoUserContextCommand = 'No user context command',
    /**
     * This comamnd is unknown to the client
     */
    UnknownMessageContextCommand = 'Unknown messgae context menu command',
    /**
     * The command has no message context runner
     */
    noMessageContextCommand = 'No message context command'
}
export type errorReason = {
    /**
     * Message of the error
     */
    message: string;
    /**
     * Cause of the error
     *
     * @default `undefined`
     */
    cause?: string;
    /**
     * Code of the error
     *
     * @default `undefined`
     */
    code?: errorCode;
    /**
     * Additional data of the error
     *
     * @default `{}`
     */
    metadata?: {
        /**
         * Name of the command that errored
         */
        commandName?: string;
    };
};
export type deniedReason = {
    /**
     * Message of the denietion
     */
    message: string;
    /**
     * Cause of the denietion
     *
     * @default `null`
     */
    cause?: string;
    /**
     * Additional data of the denietion
     *
     * @default `{}`
     */
    metadata?: {
        /**
         * Defines if the denietion is silent
         *
         * This proprety may not appear everytime
         * This is a proprety only you can use in your preconditions. It is not used by default by Amethyst JS
         */
        silent?: boolean;
        /**
         * Remaining cooldown time in milliseconds if command is denied by cooldown
         */
        remainingCooldownTime?: number;
        /**
         * Informations about permissions if command is denied by permission
         */
        permissions?: {
            /**
             * Permissions required to run the command
             */
            need: PermissionsString[];
            /**
             * Permissions that the client or the user has
             */
            got: PermissionsString[];
            /**
             * Permissions that the client or the user needs
             */
            missing: PermissionsString[];
        };
        /**
         * Informations about channel type if command is denied by channel type
         */
        channelType?: {
            /**
             * Channel types allowed by the command
             */
            expected: ChannelType[];
            /**
             * Channel type of the command
             */
            got: ChannelType;
        };
        [key: string | number]: any;
    };
    code?: commandDeniedCode | string;
};
export type canReactType = 'everyone' | 'useronly' | 'everyoneexceptuser';
export type waitForType<T extends MessageComponentType> = {
    /**
     * Message with the components
     */
    message: Message<true>;
    /**
     * User that can interact with the message
     * The `whoCanReact` proprety will depend of the user
     */
    user: User;
    /**
     * Type of the components
     */
    componentType: T;
    /**
     * Time of the waiting before canceling
     *
     * @default 120000
     */
    time?: number;
    /**
     * Users who can interact with the message
     *
     * If set to `useronly`, only the `user` can interact with the message. If another user interacts, the `replies.everyone` will be used, and if it is not defined, it will use the default value set on the client
     * If set to `everyoneexeptuser`, only the `user` can't interact with the message. If he interacts, the `replies.user` will be used, and if it is not defined, it will use the default value set on the client
     * @type 'everyone' | 'useronly' | 'everyoneexeptuser'
     * @default 'useronly'
     */
    whoCanReact?: canReactType;
    /**
     * Replies to display to the user(s) who can't interact
     *
     * @default Values set on the client
     */
    replies?: {
        /**
         * Reply to display to the `user` when he reacts if he can't
         *
         * @default Value set on the client
         */
        user?: InteractionReplyOptions;
        /**
         * Reply to display to everyone exept the user when they react if they can't
         *
         * @default Value set on the client
         */
        everyone?: InteractionReplyOptions;
    };
};
export type waitForMessageType = {
    /**
     * Channel to wait message in
     *
     * @type TextChannel from `discord.js`
     */
    channel: TextChannel;
    /**
     * User who can reply to the message
     *
     * The `whoCanReply` proprety will depend of this
     */
    user: User;
    /**
     * Defines who the bot ignores when a message come in
     *
     * If value set to `useronly`, only the `user` can reply
     * If value set to `everyoneexeptuser`, everyone exept the user can reply, and the first message will be registered
     * @type 'everyone' | 'useronly' | 'everyoneexeptuser'
     * @default 'useronly'
     */
    whoCanReply?: canReactType;
    /**
     * Time of the waiting before canceling
     *
     * @default 120000
     */
    time?: number;
};
