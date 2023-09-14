import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, EmbedBuilder, Message, MessageCreateOptions, TextChannel } from "discord.js";
import { AmethystClient } from "./AmethystClient";
import { AmethystError, ButtonDeniedCode, ButtonHandler, DebugImportance, log4js } from "..";
import { controlPanelAddOptions, controlPanelOptions } from "../typings/panel";

export class ControlPanel {
    private client: AmethystClient;
    private channelId: string;
    private channel: TextChannel
    private options: controlPanelOptions;
    private buttons: (controlPanelAddOptions & { id: string })[] = [];
    private _message: Message;

    constructor(options: controlPanelOptions) {
        this.client = options.client;
        this.channelId = options.channelID;

        this.options = {
            client: this.client,
            channelID: this.channelId,
            deleteMessages: options.deleteMessages ?? true,
            pin: options.pin ?? true,
            content: options.content ?? {  }
        }
    }

    public get message() {
        return this._message;
    }
    private get components() {
        const rows = [new ActionRowBuilder()]
        this.buttons.forEach((btn, i) => {
            if (rows.length === 5 && rows[4].components.length === 5) return;
            if (i % 5 === 0 && i > 0) rows.push(new ActionRowBuilder())

            const button = new ButtonBuilder()
                .setCustomId(btn.id)
                .setStyle(ButtonStyle[btn.style])

            if (btn.label) button.setLabel(btn.label)
            if (btn.emoji) button.setEmoji(btn.emoji)

            rows[rows.length - 1].addComponents(button)
        })

        return rows as ActionRowBuilder<ButtonBuilder>[]
    }
    private get content(): MessageCreateOptions {
        if (Object.keys(this.options.content).length === 0) {
            return {
                embeds: [new EmbedBuilder().setTitle("Control panel").setDescription(`This is the control panel of <@${this.client.application?.id}>`).setColor('#53CFF1')],
                components: this.components
            }
        }
        return {
            ...this.options.content,
            components: this.components 
        }
    }
    private amethystPanelId(int: number) {
        return `amethystjs.defaultID.${int}`
    }
    public registerButton(options: controlPanelAddOptions): this {
        if (!options.label && !options.emoji) {
            throw new AmethystError(`No button content found`)
        }
        const id = typeof options.handler === 'string' ? options.handler : this.amethystPanelId(this.components.length)
        if (this.buttons.find(x => x.id === id)) {
            throw new AmethystError(`Duplicate identifier ( got ${id} )`)
        };

        this.buttons.push({
            id,
            ...options
        })

        return this
    }
    private async init() {
        this.channel = (this.client.channels.cache.get(this.channelId) ?? await this.client.channels.fetch(this.channelId).catch(log4js.trace)) as TextChannel;
        if (!this.channel) {
            throw new AmethystError('Provided channel not found')
        }
        if (!this.channel.isTextBased()) {
            throw new AmethystError('Provided channel is not text')
        }

        const msg = await this.channel.send(this.content).catch(log4js.trace) as Message<true>
        if (!msg) return this.client.debug(`Message of panel not sended. Check logs`, DebugImportance.Error)

        this._message = msg;

        if (this.options.deleteMessages) {
            const toDelete = (
                ((await this.channel.messages.fetch().catch(log4js.trace)) ?? new Collection()) as Collection<
                    string,
                    Message<true>
                >
            )
                .filter((x) => x.id !== msg.id && x.deletable && x.createdTimestamp > Date.now() - 1209600000)
                .toJSON()
                .slice(0, 99);
            
            await this.channel.bulkDelete(toDelete).catch(log4js.trace)
        }
        if (this.options.pin) {
            const rep = await msg.pin().catch(log4js.trace)
            if (rep) this.channel.bulkDelete(1).catch(log4js.trace)
        }

        this.client.on('buttonInteraction', (button, message) => {
            const option = this.buttons.find(x => x.id === button.customId);
            if (option) {
                if (option.handler instanceof ButtonHandler) {
                    option.handler.run({
                        button,
                        user: button.user,
                        message,
                        client: this.client
                    })
                }
            }
        })

        this.client.debug(`Panel started with ${this.buttons.length} options`, DebugImportance.Information)
    }
    public start() {
        if (this.client.readyAt) {
            this.init()
        } else {
            this.client.once('ready', () => {
                this.init()
            })
        }
    }
}
