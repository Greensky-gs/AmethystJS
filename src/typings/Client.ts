import {
    ActivityOptions,
    AnySelectMenuInteraction,
    BaseInteraction,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    ChannelType,
    ComponentType,
    Embed,
    EmbedBuilder,
    InteractionReplyOptions,
    MentionableSelectMenuInteraction,
    Message,
    MessageComponentType,
    PermissionsString,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    TextChannel,
    User,
    UserSelectMenuInteraction
} from 'discord.js';

type pathLike = `./${string}`;

export type architectureType = 'simple' | 'double';
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
     * new AmethystClient({}, {
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
     * Folder for your button handlers
     * The client will fetch every button handler in this folder
     *
     * If your button handlers are in a folder called `./src/buttons` and that your project will be compiled in a `./dist` folder, put:
     * ```js
     * new AmethystClient({}, {
     *     buttonsFolder: './dist/buttons'
     * });
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
    /**
     * Type of the command folders
     *
     * If configured to 'simple', the file in the `commandsFolder` folder will be registered as commands,
     * If configured to 'double', the files in the subdirectories of `commandsFolder` will be registered as commands
     *
     * @default `simple`
     */
    commandsArchitecture?: architectureType;
    /**
     * Type of the events folder
     *
     * If configured to 'simple', the file in the `commandsFolder` folder will be registered as commands,
     * If configured to 'double', the files in the subdirectories of `commandsFolder` will be registered as commands
     *
     * @default `simple`
     */
    eventsArchitecture?: architectureType;
    /**
     * Set the command localizations to usable aliases
     *
     * If enabled, the name localizations of the message commands will be used as name indexes
     *
     * @important If the same name appears multiple times, the first command will be executed
     * @default `true`
     */
    commandLocalizationsUsedAsNames?: boolean;
    /**
     * Set the default wait time on any collector (like `waitForInteraction` or `waitForMessage` )
     *
     * Time is in milliseconds
     *
     * @default `120000`
     */
    defaultWaitTime?: number;
    /**
     * Set the default allowed react to collector methods (`waitForInteraction` or `waitForMessage` )
     *
     * @type {canReactType} : Either 'everyone', 'useronly' or 'everyoneexceptuser'
     * @default `useronly`
     */
    defaultWhoCanReact?: canReactType;
    /**
     * Default replies adressed to users when they interact with an interaction they can't in a collector
     * 
     * @default `{ user: () => ({ content: "You cannot interact with this message" }), everyone: () => ({ content: "You cannot interact with this message" }) }`
     */
    defaultReplies?: {
        /**
         * Reply to the user when everyone except is allowed to react
         * 
         * @default `() => ({ content: "You cannot interact with this message" })`
         */
        user?: waitForResponseBuilder;
        /**
         * Reply to the anyone when only the user is allowed to react
         * 
         * @default `() => ({ content: "You cannot interact with this message" })`
         */
        everyone?: waitForResponseBuilder;
    };
    /**
     * Automatically set the bot's activity to the specified value
     * 
     * @default `undefined`
     * @type {ActivityOptions}
     */
    activity?: ActivityOptions;
    /**
     * Defines if the bot has to handle the command if the content is edited
     * 
     * For instance, if the command is `!!ping`, and the user sends `!!pong`, and then he edits it as `!!ping`, the bot will run the command (or not depending on this property)
     * 
     * @default `false`
     * @type {boolean}
     */
    runMessageCommandsOnMessageEdit?: boolean;
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
    ChannelNotNsfw = 'Channel is not NSFW',
    /**
     * Command can be executed only if the user is in a voice channel
     */
    UserNotInVoiceChannel = 'User not in voice channel',
    /**
     * Command can be executed only if the user is not in a voice channel
     */
    UserInVoiceChannel = 'User is in voice channel'
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
export type waitForInteractionType = {};
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
export type waitForResponseBuilder = <T extends BaseInteraction>(options: {
    user: User;
    interaction: T;
}) => InteractionReplyOptions;
export type waitForInteractionComponent =
    | ComponentType.Button
    | ComponentType.ChannelSelect
    | ComponentType.MentionableSelect
    | ComponentType.RoleSelect
    | ComponentType.UserSelect
    | ComponentType.StringSelect;
export type waitForInteractionOptions<T extends waitForInteractionComponent> = {
    message: Message;
    time?: number;
    componentType: T;
    whoCanReact?: canReactType;
    user: User;
    replies?: {
        user?: waitForResponseBuilder;
        everyone?: waitForResponseBuilder;
    };
    onCollect?: 'nothing' | 'reply' | 'deferUpdate' | 'deferReply';
    onCollectReply?: waitForResponseBuilder;
};
export type componentToInteraction<K extends waitForInteractionComponent> = K extends ComponentType.Button
    ? ButtonInteraction
    : K extends ComponentType.ChannelSelect
      ? ChannelSelectMenuInteraction
      : K extends ComponentType.MentionableSelect
        ? MentionableSelectMenuInteraction
        : K extends ComponentType.RoleSelect
          ? RoleSelectMenuInteraction
          : K extends ComponentType.StringSelect
            ? StringSelectMenuInteraction
            : K extends ComponentType.UserSelect
              ? UserSelectMenuInteraction
              : never;
