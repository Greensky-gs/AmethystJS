import { ChannelType, PermissionsString } from "discord.js";

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
};
export type startOptions = {
    loadCommands?: boolean;
    loadEvents?: boolean;
    loadPreconditions?: boolean;
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
}
export enum errorCode {
    UnknownChatInputCommand = 'Unknown chat input command'
}
export type errorReason = {
    message: string;
    cause?: string;
    code?: errorCode;
    metadata?: {
        commandName?: string;
    }
}
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
        }
    };
    code?: commandDeniedCode;
}
