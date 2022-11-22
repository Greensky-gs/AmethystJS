import {
    ChannelType,
    InteractionReplyOptions,
    Message,
    MessageComponentType,
    MessageCreateOptions,
    MessagePayload,
    PermissionsString,
    TextChannel,
    User
} from 'discord.js';

type pathLike = `./${string}`;

export type AmethystClientOptions = {
    botName?: string;
    botNameWorksAsPrefix?: boolean;
    commandsFolder?: pathLike;
    eventsFolder?: pathLike;
    prefix?: string;
    strictPrefix?: boolean;
    mentionWorksAsPrefix?: boolean;
    token: string;
    debug?: boolean;
    defaultCooldownTime?: number;
    preconditionsFolder?: pathLike;
    autocompleteListenersFolder?: pathLike;
    waitForDefaultReplies?: {
        user?: string;
        everyone?: string;
    };
};
export type startOptions = {
    loadCommands?: boolean;
    loadEvents?: boolean;
    loadPreconditions?: boolean;
    loadAutocompleteListeners?: boolean;
};
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
    DMOnly = 'DM only',
    InvalidChannelType = 'Invalid channel type',
    OwnerOnly = 'Owner only',
    GuildOnly = 'Guild only',
    UnderCooldown = 'under cooldown',
    CustomPrecondition = 'Custom precondition failure',
    ClientMissingPerms = 'Client has not permissions',
    UserMissingPerms = 'Member missing permissions',
    UnknownChannelType = 'Could not determine channel type',
    ChannelNotNsfw = 'Channel is not NSFW'
}
export enum errorCode {
    UnknownChatInputCommand = 'Unknown chat input command',
    NoChatInputRun = 'No chat input run',
    NoMessageRun = 'No message run'
}
export type errorReason = {
    message: string;
    cause?: string;
    code?: errorCode;
    metadata?: {
        commandName?: string;
    };
};
export type deniedReason = {
    message: string;
    cause?: string;
    metadata?: {
        silent?: boolean;
        remainingCooldownTime?: number;
        permissions?: {
            need: PermissionsString[];
            got: PermissionsString[];
            missing: PermissionsString[];
        };
        channelType?: {
            expected: ChannelType[];
            got: ChannelType;
        };
        [key: string | number]: any;
    };
    code?: commandDeniedCode | string;
};
export type canReactType = 'everyone' | 'useronly' | 'everyoneexceptuser';
export type waitForType<T extends MessageComponentType> = {
    message: Message<true>;
    user: User;
    componentType: T;
    time?: number;
    whoCanReact?: canReactType;
    replies?: {
        user?: InteractionReplyOptions;
        everyone?: InteractionReplyOptions;
    };
};
export type waitForMessageType = {
    channel: TextChannel,
    user: User;
    whoCanReply?: canReactType;
    time?: number;
}
