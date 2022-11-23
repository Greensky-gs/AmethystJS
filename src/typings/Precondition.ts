import { ButtonInteraction, CacheType, CommandInteraction, CommandInteractionOptionResolver, Message, User } from 'discord.js';
import { AmethystCommand } from '../structures/Command';

export type preconditionRunReturn = {
    message?: string;
    metadata?: {
        silent?: boolean;
        code?: string;
    } & {
        [key: string | number]: any;
    };
    ok: boolean;
    interaction?: CommandInteraction<CacheType>;
    isChatInput: boolean;
    isButton?: boolean;
    button?: ButtonInteraction;
    channelMessage?: Message;
};
type BaseRun = {
    command: AmethystCommand;
};
export type PreconditionChatInputRun = (
    options: {
        interaction: CommandInteraction<CacheType>;
        options: CommandInteractionOptionResolver;
    } & BaseRun
) => preconditionRunReturn;

export type PreconditionMessageRun = (
    options: {
        message: Message;
    } & BaseRun
) => preconditionRunReturn;
export type PreconditionButtonRun = (options: {
    button: ButtonInteraction;
    user: User;
    message: Message;
}) => preconditionRunReturn;
