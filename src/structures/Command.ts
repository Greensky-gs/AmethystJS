import { ChatInputRun, commandOptions, MessageRun } from '../typings/Command';

export class AmethystCommand {
    private _chatInputRun?: ChatInputRun | undefined;
    private _messageRun?: MessageRun | undefined;
    public readonly options: commandOptions;

    constructor(options: commandOptions) {
        this.options = options;
    }
    public setChatInputRun(run: ChatInputRun) {
        this._chatInputRun = run;
        return this;
    }
    public setMessageRun(run: MessageRun) {
        this._messageRun = run;
        return this;
    }
    public get chatInputRun(): ChatInputRun | undefined {
        return this._chatInputRun;
    }
    public get messageRun(): MessageRun | undefined {
        return this._messageRun;
    }
}
