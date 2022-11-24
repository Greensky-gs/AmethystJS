import {
    PreconditionButtonRun,
    PreconditionChatInputRun,
    PreconditionMessageRun,
    preconditionRunReturn
} from '../typings/Precondition';

export class Precondition {
    public readonly name: string;
    private _chatInputRun: PreconditionChatInputRun;
    private _messageRun: PreconditionMessageRun;
    private _buttonRun: PreconditionButtonRun;

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
    public setButtonRun(run: PreconditionButtonRun) {
        this._buttonRun = run;
        return this;
    }
    public get messageRun() {
        return this._messageRun;
    }
    public get chatInputRun() {
        return this._chatInputRun;
    }
    public get buttonRun() {
        return this._buttonRun;
    }
}
