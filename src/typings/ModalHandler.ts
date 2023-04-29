import { Precondition } from '../structures/Precondition';
import {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    PermissionsString,
    User
} from 'discord.js';

export type modalHandlerRun = (options: { modal: ModalSubmitInteraction; user: User }) => unknown | void;
export type modalHandlerOptions = {
    preconditions?: Precondition[];
    name: string;
    modalId: string | string[];
};
export type ModalDenied = {
    message?: string;
    modal: ModalSubmitInteraction;
    metadata?: {
        code?: 'Custom precondition' | string | number;
        permissions?: {
            got: PermissionsString[];
            need: PermissionsString[];
            missing: PermissionsString[];
        };
        [key: string | number]: any;
    };
    user: User;
};
