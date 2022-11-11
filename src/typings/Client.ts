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
