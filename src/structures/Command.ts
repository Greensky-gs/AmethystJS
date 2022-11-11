import { ChatInputRun, commandOptions, MessageRun } from "../typings/Command";

export class AmethystCommand {
    public chatInputRun?: ChatInputRun;
    public messageRun?: MessageRun;
    public readonly options: commandOptions;

    constructor(options: commandOptions) {
        this.options = options;
    }
    public setChatInputRun(run: ChatInputRun) {
        this.chatInputRun = run;
    }
    public setMessageRun(run: MessageRun) {
        this.messageRun = run;
    }
}