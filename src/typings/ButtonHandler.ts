import { ButtonInteraction, Message, PermissionsString, User } from 'discord.js';
import { Precondition } from '../structures/Precondition';
import { AmethystClient } from '../structures/AmethystClient';

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
    /**
     * The user is missing permissions
     */
    MissingPerms = 'User is missing permissions',
    /**
     * Client is missing permissions
     */
    ClientMissingPerms = 'Client is missing permissions',
    /**
     * Custom precondition stopped the button
     */
    CustomPrecondition = 'Custom precondition',
    /**
     * The button can't be executed in a server
     */
    DMOnly = 'Direct messages only',
    /**
     * The button can't be executed in a not-nsfw channel
     */
    NsfwOnly = 'Nsfw channel only',
    /**
     * The button can't be executed in direct messages
     */
    GuildOnly = 'Guild only',
    /**
     * The system can't determine the type of the channel
     */
    UnknownChannelType = 'Unknown channel type'
}
export type ButtonDenied = {
    /**
     * Optionnal message of the denietion of the button
     */
    message?: string;
    /**
     * Button that triggered the denietion
     */
    button: ButtonInteraction;
    /**
     * Additional datas
     */
    metadata?: {
        /**
         * Optionnal code to give a unique ID to the denietion
         */
        code?: ButtonDeniedCode | string | number;
        /**
         * Permissions in case of missing permission denietion
         */
        permissions?: {
            /**
             * Permissions the client or the user has among the needed permissions
             */
            got: PermissionsString[];
            /**
             * Permissions needed to run the command
             */
            need: PermissionsString[];
            /**
             * Permissions missing to the client or the user
             */
            missing: PermissionsString[];
        };
        [key: string | number]: any;
    };
    /**
     * User of the interaction
     */
    user: User;
};
/**
 * Method of the runner
 */
export type ButtonHandlerRun = (options: {
    /**
     * Button that triggered the handler
     * 
     * @type ButtonInteraction
     */
    button: ButtonInteraction;
    /**
     * User that used the button
     * 
     * @type User
     */
    user: User;
    /**
     * Message where the button is used
     * 
     * @type Message
     */
    message: Message;
    /**
     * Client of the interaction
     * 
     * @type AmethystClient
     */
    client: AmethystClient
}) => void | unknown;
