import { ChatInputRun, commandOptions, MessageContextRun, MessageRun, UserContextRun } from '../typings/Command';

export class AmethystCommand {
    private _chatInputRun?: ChatInputRun | undefined;
    private _messageRun?: MessageRun | undefined;
    private _userContextMenuRun?: UserContextRun | undefined;
    private _messageContextMenuRun?: MessageContextRun | undefined;
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
    public setUserContextRun(run: UserContextRun) {
        this._userContextMenuRun = run;
        return this;
    }
    public setMessageContextRun(run: MessageContextRun) {
        this._messageContextMenuRun = run;
        return this
    }
    public get messageContextMenuRun(): MessageContextRun | undefined {
        return this._messageContextMenuRun
    }
    public get userContextMenuRun(): UserContextRun | undefined {
        return this._userContextMenuRun
    }
    public get chatInputRun(): ChatInputRun | undefined {
        return this._chatInputRun;
    }
    public get messageRun(): MessageRun | undefined {
        return this._messageRun;
    }
}
