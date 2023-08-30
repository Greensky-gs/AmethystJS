import { ButtonStyle, MessageCreateOptions } from "discord.js";
import { AmethystClient } from "../structures/AmethystClient"
import { ButtonHandler } from "../structures/ButtonHandler";
import { Precondition } from "../structures/Precondition";

export type controlPanelOptions = {
    /**
     * Client of the panel
     * 
     * @type {AmethystClient}
     */
    client: AmethystClient;
    /**
     * Id of the panel channel
     * 
     * @type {string}
     */
    channelID: string;
    /**
     * Delete other messages in the channel
     * 
     * @type {boolean}
     * @default true
     */
    deleteMessages?: boolean;
    /**
     * Pin the panel in the channel
     * 
     * @type {boolean}
     * @default true
     */
    pin?: boolean;
    /**
     * Content of the message
     * 
     * @type {MessageCreateOptions}
     */
    content?: MessageCreateOptions;
}
export type controlPanelAddOptions = {
    /**
     * Label of the button
     * 
     * @type {string}
     */
    label?: string;
    /**
     * Emoji of the button
     * 
     * @type {string}
     */
    emoji?: string;
    /**
     * Style of the button
     * 
     * @type {keyof Omit<typeof ButtonStyle, 'Link'>}
     */
    style: keyof Omit<typeof ButtonStyle, 'Link'>
    /**
     * Id for the button handler or a button handler itself
     * 
     * @type {string | ButtonHandler}
     */
    handler: string | ButtonHandler;
}