import { ButtonInteraction, Message, PermissionsString, User } from 'discord.js';
import { Precondition } from '../structures/Precondition';

export type ButtonHandlerOptions = {
    customId: string;
    permissions?: PermissionsString[];
    clientPermissions?: PermissionsString[];
    preconditions?: Precondition[];
};
export enum ButtonDeniedCode {
    MissingPerms = 'User is missing permissions',
    ClientMissingPerms = 'Client is missing permissions',
    CustomPrecondition = "Custom precondition",
    DMOnly = 'Direct messages only',
    NsfwOnly = 'Nsfw channel only',
    GuildOnly = 'Guild only',
    UnknownChannelType = "Unknown channel type"
}
export type ButtonDenied = {
    message?: string;
    button: ButtonInteraction;
    metadata?: {
        code?: ButtonDenied | string | number;
        permissions?: {
            got: PermissionsString[];
            need: PermissionsString[];
            missing: PermissionsString[];
        };
        [key: string | number]: any;
    };
    user: User;
};
export type ButtonHandlerRun = (options: { button: ButtonInteraction; user: User; message: Message }) => void | unknown;
