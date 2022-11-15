// Imports
import { Precondition } from './structures/Precondition';
import DMOnly from './preconditions/DMOnly';
import GuildOnly from './preconditions/GuildOnly';
import NsfwOnly from './preconditions/NsfwOnly';

// Structures
export { AmethystClient } from './structures/AmethystClient';
export { AmethystCommand } from './structures/Command';
export { Precondition } from './structures/Precondition';
export { AmethystEvent } from './structures/Event';

// Types
export { PreconditionChatInputRun, preconditionRunReturn, PreconditionMessageRun } from './typings/Precondition'
export { startOptions, AmethystClientOptions, commandDeniedCode, CommandType, errorCode, errorReason, deniedReason } from './typings/Client';
export { ChatInputRun, commandDeniedPayload, commandOptions, MessageRun } from './typings/Command';

// Objects
export const preconditions: Record<string, Precondition> = {
    DMOnly,
    GuildOnly,
    NsfwOnly
};
