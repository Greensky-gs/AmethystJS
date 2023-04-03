import {
    AnySelectMenuInteraction,
    ButtonInteraction,
    CacheType,
    ChatInputCommandInteraction,
    CommandInteraction,
    CommandInteractionOptionResolver,
    Message,
    ModalSubmitInteraction,
    User
} from 'discord.js';
import { AmethystCommand } from '../structures/Command';

export type preconditionType = 'message' | 'chatInput' | 'button' | 'modal';
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
    type: preconditionType;
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
export type PreconditionModalRun = (options: {
    modal: ModalSubmitInteraction;
    user: User;
}) => preconditionRunReturn;