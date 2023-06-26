import { ButtonInteraction, Message, PermissionsString, User } from 'discord.js';
import { Precondition } from '../structures/Precondition';

/**
 * Options of a button handler
 */
export type ButtonHandlerOptions = {
    /**
     * custom ID of the button
     *
     * This is supposed to be the id of the button you want to match with
     * @type string
     */
    customId: string;
    /**
     * Permissions the user needs to press the button
     *
     * @type PermissionString[]
     */
    permissions?: PermissionsString[];
    /**
     * Permissions the client needs in the server to press the button
     *
     * @type PermissionString[]
     */
    clientPermissions?: PermissionsString[];
    /**
     * Preconditions of the button
     *
     * @type Precondition[]
     */
    preconditions?: Precondition[];
    /**
     * Additionnal custom ids of other buttons that can match the handler
     *
     * @type string[]
     */
    identifiers?: string[];
};
export enum ButtonDeniedCode {
    MissingPerms = 'User is missing permissions',
    ClientMissingPerms = 'Client is missing permissions',
    CustomPrecondition = 'Custom precondition',
    DMOnly = 'Direct messages only',
    NsfwOnly = 'Nsfw channel only',
    GuildOnly = 'Guild only',
    UnknownChannelType = 'Unknown channel type'
}
export type ButtonDenied = {
    message?: string;
    button: ButtonInteraction;
    metadata?: {
        code?: ButtonDeniedCode | string | number;
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
