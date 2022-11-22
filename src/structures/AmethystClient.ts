import { Client, ClientEvents, ClientOptions, ApplicationCommandData, Awaitable, Partials } from 'discord.js';
import { existsSync, readdirSync } from 'fs';
import { ButtonDenied } from '../typings/ButtonHandler';
import { AmethystClientOptions, DebugImportance, deniedReason, errorReason, startOptions } from '../typings/Client';
import { commandDeniedPayload } from '../typings/Command';
import { AutocompleteListener } from './AutocompleteListener';
import { ButtonHandler } from './ButtonHandler';
import { AmethystCommand } from './Command';
import { AmethystEvent } from './Event';
import { Precondition } from './Precondition';

export class AmethystClient extends Client {
    public readonly configs: AmethystClientOptions;
    private _messageCommands: AmethystCommand[] = [];
    private _chatInputCommands: AmethystCommand[] = [];
    private _preconditions: Precondition[] = [];
    private _autocompleteListeners: AutocompleteListener[] = [];
    private _buttonHandler: ButtonHandler[] = [];

    constructor(options: ClientOptions, configs: AmethystClientOptions) {
        super(options);
        this.configs = {
            commandsFolder: configs?.commandsFolder,
            eventsFolder: configs?.eventsFolder,
            preconditionsFolder: configs?.preconditionsFolder,
            token: configs.token,
            prefix: configs?.prefix,
            botName: configs?.botName,
            botNameWorksAsPrefix: configs?.botNameWorksAsPrefix ?? false,
            mentionWorksAsPrefix: configs?.mentionWorksAsPrefix ?? false,
            debug: configs?.debug ?? false,
            strictPrefix: configs?.strictPrefix ?? false,
            defaultCooldownTime: configs?.defaultCooldownTime ?? 5,
            autocompleteListenersFolder: configs?.autocompleteListenersFolder,
            waitForDefaultReplies: {
                user: configs?.waitForDefaultReplies?.user ?? "You're not allowed to interact with this message",
                everyone: configs?.waitForDefaultReplies?.everyone ?? "You're not allowed to interact with this message"
            },
            buttonsFolder: configs?.buttonsFolder
        };
    }
    public start({
        loadCommands = true,
        loadEvents = true,
        loadPreconditions = true,
        loadAutocompleteListeners = true,
        loadButtons = true
    }: startOptions) {
        this.login(this.configs.token);

        this.loadCommands(loadCommands);
        this.loadEvents(loadEvents);
        this.loadPreconditions(loadPreconditions);
        this.loadAutocompleteListeners(loadAutocompleteListeners);
        this.loadButtons(loadButtons);

        this.checks();
        this.loadInternalEvents();
        this.listenCommandDenied();
    }
    private loadButtons(load: boolean) {
        if (!load) return this.debug(`Buttons configured to not loaded`, DebugImportance.Information);
        if (!this.configs.buttonsFolder)
            return this.debug('Buttons folder not configured', DebugImportance.Information);
        if (!existsSync(this.configs.buttonsFolder))
            return this.debug(`Buttons folder does not exist`, DebugImportance.Unexpected);

        readdirSync(this.configs.buttonsFolder).forEach((fileName) => {
            const x = require(`../../../../${this.configs.buttonsFolder}`);
            const button: ButtonHandler = x?.default ?? x;

            if (!button || !(button instanceof ButtonHandler))
                return this.debug(
                    `Default value of file ${this.configs.buttonsFolder}/${fileName} is not an Amethyst button handler`,
                    DebugImportance.Critical
                );

            if (this._buttonHandler.find((x) => x.options.customId === button.options.customId))
                return this.debug(
                    `Duplicate identifier for ${button.options.customId} (button handler in ${this.configs.buttonsFolder}/${fileName})`,
                    DebugImportance.Unexpected
                );

            this._buttonHandler.push(button);
            this.debug(
                `Button handler loaded: ${button.options.customId} (${this.configs.buttonsFolder}/${fileName})`,
                DebugImportance.Information
            );
        });
        this.debug(
            `Button handlers loading ended: ${this._buttonHandler.length} handler(s) loaded`,
            DebugImportance.Information
        );
    }
    private loadCommands(load: boolean) {
        if (!load) return this.debug('Commands configured to not loaded', DebugImportance.Information);
        if (!this.configs.commandsFolder)
            return this.debug('Command folder not configured', DebugImportance.Information);
        if (!existsSync(this.configs.commandsFolder))
            return this.debug("Command folder doesn'exist", DebugImportance.Unexpected);

        readdirSync(this.configs.commandsFolder).forEach((commandFile: string) => {
            let x = require(`../../../../${this.configs.commandsFolder}/${commandFile}`);
            const command: AmethystCommand = x?.default ?? x;
            if (!command || !(command instanceof AmethystCommand))
                return this.debug(
                    `default value of file ${this.configs.commandsFolder}/${commandFile} is not an amhetyst command`,
                    DebugImportance.Critical
                );

            if (!command.options.aliases) command.options.aliases = [];
            command.options.aliases = command.options.aliases
                .map((x) => x.toLowerCase())
                .filter((x) => x !== command.options.name.toLowerCase());

            if (command.chatInputRun && !this._chatInputCommands.find((x) => x.options.name === command.options.name))
                this._chatInputCommands.push(command);
            if (command.messageRun && !this._messageCommands.find((x) => x.options.name === command.options.name))
                this._messageCommands.push(command);

            this.debug(
                `Command loaded: ${command.options.name} as ${this.getLoadingType(command)}`,
                DebugImportance.Information
            );
        });
        this.debug(
            `Commands loaded : ${this._messageCommands.length} message commands and ${this._chatInputCommands.length} slash commands`,
            DebugImportance.Information
        );

        if (this._chatInputCommands.length > 0) {
            this.on('ready', () => {
                const sc: ApplicationCommandData[] = this._chatInputCommands.map((cmd) => cmd.options);
                this.application.commands.set(sc).catch((error) => {
                    this.debug(`Error on chat input commands deployment: ${error}`, DebugImportance.Error);
                });
            });
        } else {
            this.on('ready', () => {
                this.application.commands.set([]).catch((error) => {
                    this.debug(`Error on chat input commands deployment: ${error}`, DebugImportance.Error);
                });
            });
        }
    }
    private loadPreconditions(load: boolean) {
        if (!load) return this.debug(`Preconditions configured to not loaded`, DebugImportance.Information);
        if (!this.configs.preconditionsFolder)
            return this.debug('Preconditions folder not configued', DebugImportance.Information);
        if (!existsSync(this.configs.preconditionsFolder))
            return this.debug(
                `This folder does not exists: ${this.configs.preconditionsFolder} for preconditions`,
                DebugImportance.Error
            );

        readdirSync(this.configs.preconditionsFolder).forEach((fileName) => {
            let x = require(`../../../../${this.configs.preconditionsFolder}/${fileName}`);
            const file: Precondition = x?.default ?? x;

            if (!file || !(file instanceof Precondition)) {
                return this.debug(
                    `File ${this.configs.preconditionsFolder}/${fileName} is not a precondition`,
                    DebugImportance.Critical
                );
            }

            this._preconditions.push(file);
            this.debug(`Precondition loaded: ${file.name}`, DebugImportance.Information);
        });
        this.debug(`${this._preconditions.length} precondition(s) loaded`, DebugImportance.Information);
    }
    private getLoadingType(cmd: AmethystCommand): string {
        const types = [];
        if (cmd.chatInputRun) types.push('chat input');
        if (cmd.messageRun) types.push('message');

        if (types.length === 2) return `a chat input and a message command`;
        return `a ${types[0]} command`;
    }
    private listenCommandDenied() {
        this.on('commandDenied', (command, reason) => {
            this.debug(
                `Command denied: ${command.command.options.name} (${command.isMessage ? 'message' : 'chat input'}) ${
                    reason.message
                } ( Code: ${reason.code ?? 'Not given'} )`,
                DebugImportance.Information
            );
        });
        this.on('commandError', (command, reason) => {
            this.debug(
                `Command error: ${command.command.options.name} (${command.isMessage ? 'message' : 'chat input'}) ${
                    reason.message
                } ( Code: ${reason.code ?? 'Not given'} )`,
                DebugImportance.Error
            );
        });
    }
    private loadEvents(load: boolean) {
        if (!load) return this.debug('Events configured to not loaded', DebugImportance.Information);
        if (!this.configs.eventsFolder) return this.debug('Events folder not configured', DebugImportance.Information);
        if (!existsSync(this.configs.eventsFolder))
            return this.debug("Events folder doesn't exist", DebugImportance.Unexpected);

        let eventsCount = 0;
        readdirSync(this.configs.eventsFolder).forEach((eventFile: string) => {
            let x = require(`../../../../${this.configs.eventsFolder}/${eventFile}`);
            const event: AmethystEvent<keyof ClientEvents> = x?.default ?? x;

            if (!event || !(event instanceof AmethystEvent))
                return this.debug(
                    `Default value of file ${this.configs.eventsFolder}/${eventFile} is not an amethyst event`,
                    DebugImportance.Critical
                );

            this.on(event.key, event.run as Awaitable<any>);
            eventsCount++;
            this.debug(`Event loaded: ${event.key}`, DebugImportance.Information);
        });
        this.debug(`Events loading ended: ${eventsCount} event(s) have been loaded`, DebugImportance.Information);
    }
    private loadAutocompleteListeners(load: boolean) {
        if (!load) return this.debug('Autocomplete Listeners configured to not loaded', DebugImportance.Information);
        if (!this.configs.autocompleteListenersFolder)
            return this.debug('Autocomplete Listeners folder not configured', DebugImportance.Information);
        if (!existsSync(this.configs.autocompleteListenersFolder))
            return this.debug("Autocomplete Listeners folder doesn't exist", DebugImportance.Unexpected);

        let count = 0;
        readdirSync(this.configs.autocompleteListenersFolder).forEach((file: string) => {
            let x = require(`../../../../${this.configs.autocompleteListenersFolder}/${file}`);
            const listener: AutocompleteListener = x?.default ?? x;

            if (!listener || !(listener instanceof AutocompleteListener))
                return this.debug(
                    `Default value of file ${this.configs.autocompleteListenersFolder}/${file} is not an amethyst Autocomplete Listeners`,
                    DebugImportance.Critical
                );

            if (this._autocompleteListeners.find((x) => x.name === listener.name)) {
                this.debug(
                    `Duplicate identifier for an autocomplete. Received ${listener.name} twice`,
                    DebugImportance.Critical
                );
                throw new Error(`Duplicate identifier for an autocomplete listener`);
            }
            this._autocompleteListeners.push(listener);
            count++;
            this.debug(`Autocomplete Listeners loaded: ${listener.name}`, DebugImportance.Information);
        });
        this.debug(
            `Autocomplete Listeners loading ended: ${count} Autocomplete Listeners(s) have been loaded`,
            DebugImportance.Information
        );
    }
    private checks() {
        if (
            this._messageCommands.filter(
                (x) =>
                    x.options.preconditions?.filter((x) => x.name === 'DMOnly') ||
                    !x.options.preconditions?.map((x) => x.name).includes('GuildOnly')
            )?.length > 0 &&
            (!this.options.partials ||
                this.options.partials.length === 0 ||
                !this.options.partials.includes(Partials.Message) ||
                !this.options.partials.includes(Partials.Channel))
        ) {
            throw new Error(
                'You need Message and Channel partial on your client if you want use it in direct messages'
            );
        }
    }
    public debug(msg: string, imp: DebugImportance) {
        if (this.configs.debug) console.log(`[${imp}] ${msg}`);
    }
    public get messageCommands(): AmethystCommand[] {
        return this._messageCommands;
    }
    public get chatInputCommands(): AmethystCommand[] {
        return this._chatInputCommands;
    }
    public get preconditions(): Precondition[] {
        return this.preconditions;
    }
    public get autocompleteListeners(): AutocompleteListener[] {
        return this._autocompleteListeners;
    }
    public get buttonHandlers(): ButtonHandler[] {
        return this.buttonHandlers;
    }
    private loadInternalEvents(): void {
        const interactionCreate = require(`../events/interactionCreate.js`).default;
        const messageCreate = require(`../events/messageCreate.js`).default;
        [interactionCreate, messageCreate].forEach((x) => this.on(x.key, x.run as Awaitable<any>));
    }
}

declare module 'discord.js' {
    interface ClientEvents {
        commandDenied: [command: commandDeniedPayload, reason: deniedReason];
        commandError: [command: commandDeniedPayload, reason: errorReason];
        buttonInteraction: [interaction: ButtonInteraction, message: Message];
        selectMenuInteraction: [interaction: SelectMenuInteraction, message: Message];
        modalSubmit: [interaction: ModalSubmitInteraction];
        buttonDenied: [options: ButtonDenied];
    }
    interface Client {
        readonly configs: AmethystClientOptions;

        start(options: startOptions): void;
        debug(msg: string, imp: DebugImportance): void;

        get messageCommands(): AmethystCommand[];
        get chatInputCommands(): AmethystCommand[];
        get preconditions(): Precondition[];
        get autocompleteListeners(): AutocompleteListener[];
        get buttonHandlers(): ButtonHandler[];
    }
}
