import { PreconditionChatInputRun, PreconditionMessageRun } from '../typings/Precondition';

export class Precondition {
    public readonly name: string;
    private _chatInputRun: PreconditionChatInputRun;
    private _messageRun: PreconditionMessageRun;

    constructor(name: string) {
        this.name = name;
    }
    public setChatInputRun(run: PreconditionChatInputRun) {
        this._chatInputRun = run;
        return this;
    }
    public setMessageRun(run: PreconditionMessageRun) {
        this._messageRun = run;
        return this;
    }
    public get chatInputRun(): PreconditionChatInputRun {
        return this._chatInputRun;
    }
    public get messageRun(): PreconditionMessageRun {
        return this._messageRun;
    }
}
