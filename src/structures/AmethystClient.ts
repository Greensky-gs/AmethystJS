import { Client, ClientEvents, ClientOptions, ApplicationCommandData } from 'discord.js';
import { existsSync, readdirSync } from 'fs';
import { AmethystClientOptions, DebugImportance, deniedReason, errorReason, startOptions } from '../typings/Client';
import { commandDeniedPayload } from '../typings/Command';
import { AmethystCommand } from './Command';
import { AmethystEvent } from './Event';
import { Precondition } from './Precondition';

export class AmethystClient extends Client {
    public readonly configs: AmethystClientOptions;
    private _messageCommands: AmethystCommand[];
    private _chatInputCommands: AmethystCommand[];
    private _preconditions: Precondition[];

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
            defaultCooldownTime: configs?.defaultCooldownTime ?? 5
        };
    }
    public start({ loadCommands = true, loadEvents = true, loadPreconditions = true }: startOptions) {
        this.login(this.configs.token);

        this.loadCommands(loadCommands);
        this.loadEvents(loadEvents);
        this.loadPreconditions(loadPreconditions);

        this.listenCommandDenied();
    }
    private loadCommands(load: boolean) {
        if (!load) return this.debug('Commands configured to not loaded', DebugImportance.Information);
        if (!this.configs.commandsFolder)
            return this.debug('Command folder not configured', DebugImportance.Information);
        if (!existsSync(this.configs.commandsFolder))
            return this.debug("Command folder doesn'exist", DebugImportance.Unexpected);

        readdirSync(this.configs.commandsFolder).forEach((commandFile: string) => {
            const command: AmethystCommand = require(`${this.configs.commandsFolder}/${commandFile}`)?.default;
            if (!command || !(command instanceof AmethystCommand))
                return this.debug(
                    `default value of file ${this.configs.commandsFolder}/${commandFile} is not an amhetyst command`,
                    DebugImportance.Critical
                );

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
        }
    }
    private loadPreconditions(load: boolean) {
        if (!load) return this.debug(`Preconditions configured to not loaded`, DebugImportance.Information);
        if (!this.configs.preconditionsFolder)
            return this.debug('Command folder not configued', DebugImportance.NotUnderstand);
        if (!existsSync(this.configs.preconditionsFolder))
            return this.debug(
                `This folder does not exists: ${this.configs.preconditionsFolder} for preconditions`,
                DebugImportance.Error
            );

        readdirSync(this.configs.preconditionsFolder).forEach((fileName) => {
            const file: Precondition = require(`${this.configs.preconditionsFolder}/${fileName}`).default;

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
            const event: AmethystEvent<keyof ClientEvents> =
                require(`${this.configs.eventsFolder}/${eventFile}`)?.default;

            if (!event || !(event instanceof AmethystEvent))
                return this.debug(
                    `Default value of file ${this.configs.eventsFolder}/${eventFile} is not an amethyst event`,
                    DebugImportance.Critical
                );

            eventsCount++;
            this.debug(`Event loaded: ${event.key}`, DebugImportance.Information);
        });
        this.debug(`Events loading ended: ${eventsCount} event(s) have been loaded`, DebugImportance.Information);
    }
    public debug(msg: string, imp: DebugImportance) {
        if (this.configs.debug === true) this.emit('amethystDebug', `\n\n[${imp}] ${msg}`);
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
}

declare module 'discord.js' {
    interface ClientEvents {
        amethystDebug: [message: string];
        commandDenied: [command: commandDeniedPayload, reason: deniedReason];
        commandError: [command: commandDeniedPayload, reason: errorReason];
    }
    interface Client {
        readonly configs: AmethystClientOptions;
        start(options: startOptions): void;
        debug(msg: string, imp: DebugImportance): void;
        get messageCommands(): AmethystCommand[];
        get chatInputCommands(): AmethystCommand[];
        get preconditions(): Precondition[];
    }
}
