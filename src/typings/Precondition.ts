import { CacheType, CommandInteraction, CommandInteractionOptionResolver, Message } from 'discord.js';
import { AmethystCommand } from '../structures/Command';

export type preconditionRunReturn = {
    message?: string;
    metadata?: {
        silent?: boolean;
        code?: string;
    };
    ok: boolean;
    interaction?: CommandInteraction<CacheType>;
    isChatInput: boolean;
    channelMessaeg?: Message;
};
type BaseRun = {
    command: AmethystCommand;
}
export type PreconditionChatInputRun = (options: {
    interaction: CommandInteraction<CacheType>;
    options: CommandInteractionOptionResolver;
} & BaseRun) => preconditionRunReturn;

export type PreconditionMessageRun = (options: {
    message: Message
} & BaseRun) => preconditionRunReturn;