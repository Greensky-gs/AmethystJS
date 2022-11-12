type pathLike = `./${string}`;

export type AmethystClientOptions = {
    commandsFolder?: pathLike;
    eventsFolder?: pathLike;
    prefix?: string;
    token: string;
    debug?: boolean;
};
export type startOptions = {
    loadCommands?: boolean;
    loadEvents?: boolean;
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
    InvalidChannelType = 'Invalid type',
    OwnerOnly = 'Owner only',
    GuildOnly = 'Guild only',
    UnderCooldown = 'under cooldown',
    CustomPrecondition = 'Custom precondition failure'
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
    };
    code?: commandDeniedCode;
}
