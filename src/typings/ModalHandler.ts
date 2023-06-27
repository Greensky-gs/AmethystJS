import { AmethystClient } from '../structures/AmethystClient';
import { Precondition } from '../structures/Precondition';
import {
    AnySelectMenuInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    PermissionsString,
    User
} from 'discord.js';

/**
 * Method runned on a modal interaction
 */
export type modalHandlerRun = (options: {
    /**
     * Modal that triggered the handler
     * 
     * @type ModalSubmitInteraction
     */
    modal: ModalSubmitInteraction;
    /**
     * User that created the modal
     * 
     * @type User
     */
    user: User;
    /**
     * Client of the modal
     * 
     * @type AmethystClient
     */
    client: AmethystClient;
}) => unknown | void;

/**
 * Options of a modal handler
 */
export type modalHandlerOptions = {
    /**
     * Optionnal preconditions to be checked before the execution of the modal
     * 
     * @type Precondition[]
     */
    preconditions?: Precondition[];
    /**
     * Name you want to give to the handler
     * 
     * @type string
     */
    name: string;
    /**
     * Custom ids of the modals handled by the handler
     * 
     * @type string | string[]
     */
    modalId: string | string[];
};

/**
 * Propreties of a modal denietion
 */
export type ModalDenied = {
    /**
     * Optionnal message of the modal denietion
     */
    message?: string;
    /**
     * Modal that triggered the handler
     */
    modal: ModalSubmitInteraction;
    /**
     * Optionnal datas
     */
    metadata?: {
        /**
         * Optionnal code you want to give to create a unique code to the denietion
         */
        code?: 'Custom precondition' | string | number;
        /**
         * Permissions in case of permissions denietion
         */
        permissions?: {
            /**
             * Permissions that the user or the client has among the required permissions
             */
            got: PermissionsString[];
            /**
             * Permissions required by the client or the user to run the modal
             */
            need: PermissionsString[];
            /**
             * Permissions missing to the user or the client among the required permissions
             */
            missing: PermissionsString[];
        };
        [key: string | number]: any;
    };
    /**
     * user that created the interaction
     * 
     * @type User
     */
    user: User;
};
