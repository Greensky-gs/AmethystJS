import { ChatInputRun, commandOptions, MessageRun } from '../typings/Command';

export class AmethystCommand {
    private _chatInputRun?: ChatInputRun;
    private _messageRun?: MessageRun;
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
    public get chatInputRun(): ChatInputRun {
        return this._chatInputRun;
    }
    public get messageRun(): MessageRun {
        return this._messageRun;
    }
}
