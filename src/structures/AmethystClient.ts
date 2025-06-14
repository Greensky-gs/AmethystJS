import {
    Client,
    ClientEvents,
    ClientOptions,
    ApplicationCommandData,
    Awaitable,
    Partials,
    ContextMenuCommandBuilder,
    ContextMenuCommandType,
} from 'discord.js';
import { existsSync, readdirSync } from 'node:fs';
import { AmethystClientOptions, DebugImportance, deniedReason, errorReason, startOptions } from '../typings/Client';
import { AutocompleteListener } from './AutocompleteListener';
import { ButtonHandler } from './ButtonHandler';
import { AmethystCommand } from './Command';
import { AmethystEvent } from './Event';
import { Precondition } from './Precondition';
import { PrefixesManager } from './prefixManager';
import { ModalHandler } from './ModalHandler';
import { AmethystError } from './AmethystError';
import { ButtonDenied } from '../typings/ButtonHandler';
import { commandDeniedPayload } from '../typings/Command';
import { ModalDenied } from '../typings/ModalHandler';

export class AmethystClient extends Client {
    public readonly configs: AmethystClientOptions;
    public readonly prefixesManager: PrefixesManager = new PrefixesManager(this);

    private _messageCommands: AmethystCommand[] = [];
    private _chatInputCommands: AmethystCommand[] = [];
    private _preconditions: Precondition[] = [];
    private _autocompleteListeners: AutocompleteListener[] = [];
    private _buttonHandler: ButtonHandler[] = [];
    private _modalHandlers: ModalHandler[] = [];
    private _userContextCommands: AmethystCommand[] = [];
    private _messageContextCommands: AmethystCommand[] = [];

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
            defaultReplies: {
                user: (configs?.defaultReplies?.user) ?? (() => ({ content: "You're not allowed to interact with this message" })),
                everyone: (configs?.defaultReplies?.everyone) ?? (() => ({ content: "You're not allowed to interact with this message" }))
            },
            buttonsFolder: configs?.buttonsFolder,
            customPrefixAndDefaultAvailable: configs?.customPrefixAndDefaultAvailable ?? true,
            modalHandlersFolder: configs?.modalHandlersFolder,
            debuggerColors: configs?.debuggerColors ?? 'icon',
            commandsArchitecture: configs?.commandsArchitecture ?? 'simple',
            eventsArchitecture: configs?.eventsArchitecture ?? 'simple',
            commandLocalizationsUsedAsNames: configs?.commandLocalizationsUsedAsNames ?? false,
            defaultWaitTime: Math.round(Math.abs(configs?.defaultCooldownTime ?? 60000)),
            defaultWhoCanReact: configs?.defaultWhoCanReact ?? 'useronly',
            runMessageCommandsOnMessageEdit: configs?.runMessageCommandsOnMessageEdit ?? false,
            activity: configs?.activity,
        };
    }
    public start({
        loadCommands = true,
        loadEvents = true,
        loadPreconditions = true,
        loadAutocompleteListeners = true,
        loadButtons = true,
        loadModals = true
    }: startOptions) {
        this.login(this.configs.token);

        this.loadCommands(loadCommands);
        this.loadEvents(loadEvents);
        this.loadPreconditions(loadPreconditions);
        this.loadAutocompleteListeners(loadAutocompleteListeners);
        this.loadButtons(loadButtons);
        this.loadModals(loadModals);

        this.checks();
        this.loadInternalEvents();
        this.listenCommandDenied();

        this.once('ready', () => {
            if (!!this.configs.activity) {
                this.user.setActivity({
                    name: this.configs.activity?.name,
                    type: this.configs.activity?.type,
                    url: this.configs.activity?.url,
                    shardId: this.configs.activity?.shardId
                })
            }
        })
    }
    private loadModals(load: boolean) {
        if (!load) return this.debug(`Modals configured to not loaded`, DebugImportance.Information);
        if (!this.configs.modalHandlersFolder)
            return this.debug(`Modals folder not configured`, DebugImportance.Information);
        if (!existsSync(this.configs.modalHandlersFolder))
            return this.debug(`Modals folder does not exist`, DebugImportance.Unexpected);

        readdirSync(this.configs.modalHandlersFolder).forEach((fileName) => {
            const x = require(`../../../../${this.configs.modalHandlersFolder}/${fileName}`);
            const modalHandler: ModalHandler = x?.default ?? x;
            if (!modalHandler || !(modalHandler instanceof ModalHandler))
                return this.debug(
                    `Default value of file ${this.configs.modalHandlersFolder}/${fileName} is not an Amethyst Modal handler`,
                    DebugImportance.Critical
                );

            if (this._modalHandlers.find((x) => modalHandler.ids.some((y) => x.ids.includes(y))))
                return this.debug(
                    `Duplicate identifier for ${modalHandler.ids[0]} ( modal handler in ${this.configs.modalHandlersFolder}/${fileName} )`,
                    DebugImportance.Unexpected
                );

            this._modalHandlers.push(modalHandler);
            this.debug(
                `Button handler loaded: ${modalHandler.ids[0]} ( ${this.configs.modalHandlersFolder}/${fileName} )`,
                DebugImportance.Information
            );
        });
        this.debug(
            `Modal handlers loading ended: ${this._modalHandlers.length} handler(s) loaded`,
            DebugImportance.Information
        );
    }
    private loadButtons(load: boolean) {
        if (!load) return this.debug(`Buttons configured to not loaded`, DebugImportance.Information);
        if (!this.configs.buttonsFolder)
            return this.debug('Buttons folder not configured', DebugImportance.Information);
        if (!existsSync(this.configs.buttonsFolder))
            return this.debug(`Buttons folder does not exist`, DebugImportance.Unexpected);

        readdirSync(this.configs.buttonsFolder).forEach((fileName) => {
            const x = require(`../../../../${this.configs.buttonsFolder}/${fileName}`);
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

        const callback = (command: AmethystCommand, path: string) => {
            if (!command || !(command instanceof AmethystCommand))
                return this.debug(`default value of file ${path} is not an amhetyst command`, DebugImportance.Critical);

            if (!command.options.aliases) command.options.aliases = [];
            command.options.aliases = command.options.aliases
                .map((x) => x.toLowerCase())
                .filter((x) => x !== command.options.name.toLowerCase());

            if (command.chatInputRun && !this._chatInputCommands.find((x) => x.options.name === command.options.name))
                this._chatInputCommands.push(command);
            if (command.messageRun && !this._messageCommands.find((x) => x.options.name === command.options.name))
                this._messageCommands.push(command);
            if (
                command.userContextMenuRun &&
                !this._userContextCommands.find((x) => x.options.name === command.options.name)
            ) {
                this._userContextCommands.push(command);
            }
            if (
                command.messageContextMenuRun &&
                !this._messageContextCommands.find((x) => x.options.name === command.options.name)
            )
                this._messageContextCommands.push(command);

            this.debug(
                `Command loaded: ${command.options.name} as ${this.getLoadingType(command)}`,
                DebugImportance.Information
            );
        };
        if (this.configs.commandsArchitecture === 'simple') {
            readdirSync(this.configs.commandsFolder).forEach((commandFile: string) => {
                let x = require(`../../../../${this.configs.commandsFolder}/${commandFile}`);
                const command: AmethystCommand = x?.default ?? x;

                callback(command, `${this.configs.commandsFolder}/${commandFile}`);
            });
        } else if (this.configs.commandsArchitecture === 'double') {
            readdirSync(this.configs.commandsFolder).forEach((dir) => {
                readdirSync(`${this.configs.commandsFolder}/${dir}`).forEach((commandFile) => {
                    const path = `${this.configs.commandsFolder}/${dir}/${commandFile}`;
                    let x = require(`../../../../${path}`);
                    const command: AmethystCommand = x?.default ?? x;

                    callback(command, path);
                    //TODO tester l'architecture double et prettier
                });
            });
        } else {
            throw new AmethystError('Architecture option is incorrectly defined');
        }
        this.debug(
            `Commands loaded : ${this._messageCommands.length} message commands, ${this._chatInputCommands.length} slash commands, ${this._userContextCommands.length} user context menus and ${this._messageContextCommands.length} message context menus`,
            DebugImportance.Information
        );

        if (
            this._chatInputCommands.length + this._userContextCommands.length + this._messageContextCommands.length >
            0
        ) {
            this.on('ready', () => {
                this.user.setActivity()
                const sc: (ApplicationCommandData | ContextMenuCommandBuilder)[] = [
                    ...this._chatInputCommands.map((cmd) => cmd.options),
                    ...this._userContextCommands.map((x) =>
                        new ContextMenuCommandBuilder()
                            .setName(x.options.userContextName ?? x.options.name)
                            .setType(2)
                    ),
                    ...this._messageContextCommands.map((x) =>
                        new ContextMenuCommandBuilder()
                            .setName(x.options.messageContextName ?? x.options.name)
                            .setType(3)
                    )
                ];

                this.application.commands.set(sc).catch((error) => {
                    this.debug(`Error on commands deployment: ${error}`, DebugImportance.Error);
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
        if (cmd.userContextMenuRun) types.push('user context menu');
        if (cmd.messageContextMenuRun) types.push('message context menu');

        return `${types.join(', ')} command`;
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
        this.on('buttonDenied', (options) => {
            this.debug(
                `A button has been denied: ${options.button.customId} (customId). Code: ${
                    options.metadata?.code ?? 'Not given'
                }: ${options.message ?? 'No message'}`,
                DebugImportance.Information
            );
        });
    }
    private loadEvents(load: boolean) {
        if (!load) return this.debug('Events configured to not loaded', DebugImportance.Information);
        if (!this.configs.eventsFolder) return this.debug('Events folder not configured', DebugImportance.Information);
        if (!existsSync(this.configs.eventsFolder))
            return this.debug("Events folder doesn't exist", DebugImportance.Unexpected);

        let eventsCount = 0;
        const callback = (ev: AmethystEvent<keyof ClientEvents>, path: string) => {
            if (!ev || !(ev instanceof AmethystEvent))
                return this.debug(`Default value of file ${path} is not an amethyst event`, DebugImportance.Critical);

            eventsCount++;
            this.on(ev.key, ev.run as Awaitable<any>);
            this.debug(`Event loaded: ${ev.key}`, DebugImportance.Information);
        };
        if (this.configs.eventsArchitecture === 'simple') {
            readdirSync(this.configs.eventsFolder).forEach((eventFile: string) => {
                let x = require(`../../../../${this.configs.eventsFolder}/${eventFile}`);
                const event: AmethystEvent<keyof ClientEvents> = x?.default ?? x;

                callback(event, `${this.configs.eventsFolder}/${eventFile}`);
            });
        } else if (this.configs.eventsArchitecture === 'double') {
            readdirSync(this.configs.eventsFolder).forEach((eventDir) => {
                readdirSync(`${this.configs.eventsFolder}/${eventDir}`).forEach((fileName) => {
                    let x = require(`../../../../${this.configs.eventsFolder}/${eventDir}/${fileName}`);
                    const event: AmethystEvent<keyof ClientEvents> = x?.default ?? x;

                    callback(event, `${this.configs.eventsFolder}/${eventDir}/${fileName}`);
                });
            });
        }
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
            this._autocompleteListeners.push(listener);
            count++;
            this.debug(`Autocomplete Listeners loaded: ${listener.listenerName}`, DebugImportance.Information);
        });
        this.debug(
            `Autocomplete Listeners loading ended: ${count} Autocomplete Listeners(s) have been loaded`,
            DebugImportance.Information
        );
    }
    private checks() {
        if (this._messageCommands.length > 0 && !this.configs.prefix) {
            throw new AmethystError(`You have to set a prefix if you want to use message commands`);
        }
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
        if (this.messageCommands.length > 0 && !this.configs.prefix) {
            throw new Error('Prefix not configured. Please configure it with the `prefix` proprety of the client');
        }
    }
    public debug(msg: string, imp: DebugImportance) {
        const colors: Record<DebugImportance, number> = {
            '#': 91,
            '*': 36,
            '!!': 31,
            '?': 93,
            '??': 90,
            '!': 33
        };

        const message = () => {
            if (this.configs.debuggerColors === 'none') return `[${imp}] ${msg}`;
            if (this.configs.debuggerColors === 'icon') return `\x1b[${colors[imp]}m[${imp}]\x1b[0m ${msg}`;
            if (this.configs.debuggerColors === 'line') return `\x1b[${colors[imp]}m[${imp}] ${msg}\x1b[0m`;
        };
        if (this.configs.debug) console.log(message());
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
        return this._buttonHandler;
    }
    public get modalHandlers(): ModalHandler[] {
        return this._modalHandlers;
    }
    public get userContextCommands() {
        return this._userContextCommands;
    }
    public get messageContextCommands() {
        return this._messageContextCommands;
    }
    private loadInternalEvents(): void {
        const interactionCreate = require(`../events/interactionCreate.js`).default;
        const messageCreate = require(`../events/messageCreate.js`).default;
        [interactionCreate, messageCreate].forEach((x) => this.on(x.key, x.run as Awaitable<any>));

        if (this.configs.runMessageCommandsOnMessageEdit) {
            const messageUpdate = require(`../events/messageUpdate.js`).default;
            this.on(messageUpdate.key, messageUpdate.run as Awaitable<any>);
        }

        this.on('ready', () => {
            this.debug(`Logged as ${this.user.tag}`, DebugImportance.Information);
        });
    }
}

declare module 'discord.js' {
    interface ClientEvents {
        amethystDebug: [message: string];
        commandDenied: [command: commandDeniedPayload, reason: deniedReason];
        commandError: [command: commandDeniedPayload, reason: errorReason];
        buttonInteraction: [interaction: ButtonInteraction, message: Message];
        modalSubmit: [interaction: ModalSubmitInteraction];
        buttonDenied: [button: ButtonDenied];
        stringSelectInteraction: [selector: StringSelectMenuInteraction];
        selectMenuInteraction: [selector: AnySelectMenuInteraction];
        roleSelectInteraction: [selector: RoleSelectMenuInteraction];
        userSelectInteraction: [selector: UserSelectMenuInteraction];
        channelSelectInteraction: [selector: ChannelSelectMenuInteraction];
        mentionableSelectInteraction: [selector: MentionableSelectMenuInteraction];
        modalRejected: [reason: ModalDenied];
    }
    interface Client {
        readonly configs: AmethystClientOptions;
        readonly prefixesManager: PrefixesManager;
        get messageCommands(): AmethystCommand[];
        get chatInputCommands(): AmethystCommand[];
        get preconditions(): Precondition[];
        get autocompleteListeners(): AutocompleteListener[];
        get buttonHandlers(): ButtonHandler[];
        get modalHandlers(): ModalHandler[];
        get userContextCommands(): AmethystCommand[];
        get messageContextCommands(): AmethystCommand[];
        start(options: startOptions): void;
        debug(msg: string, imp: DebugImportance): void;
    }
}
