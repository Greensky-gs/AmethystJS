// Imports
import { Precondition } from './structures/Precondition';
import DMOnly from './preconditions/DMOnly';
import GuildOnly from './preconditions/GuildOnly';
import NsfwOnly from './preconditions/NsfwOnly';
import * as log4JS from './utils/log4js';

// Structures
export { AmethystClient } from './structures/AmethystClient';
export { AmethystCommand } from './structures/Command';
export { Precondition } from './structures/Precondition';
export { AmethystEvent } from './structures/Event';
export { AutocompleteListener } from './structures/AutocompleteListener';
export { ButtonHandler } from './structures/ButtonHandler';

// Types
export { PreconditionChatInputRun, preconditionRunReturn, PreconditionMessageRun } from './typings/Precondition';
export {
    startOptions,
    AmethystClientOptions,
    commandDeniedCode,
    CommandType,
    errorCode,
    errorReason,
    deniedReason,
    waitForType,
    canReactType,
    DebugImportance,
    waitForMessageType,
} from './typings/Client';
export { ButtonDenied, ButtonDeniedCode, ButtonHandlerOptions, ButtonHandlerRun } from './typings/ButtonHandler';
export { ChatInputRun, commandDeniedPayload, commandOptions, MessageRun } from './typings/Command';
export {
    AutocompleteListenerOptions,
    AutocompleteListenerRun,
    autocompleteListenerNamesType
} from './typings/autocompleteListener';

// Objects
export const preconditions: Record<string, Precondition> = {
    DMOnly,
    GuildOnly,
    NsfwOnly
};
export const log4js = log4JS
export { waitForInteraction } from './utils/waitForInteraction';
export { waitForMessage } from './utils/waitForMessage';
