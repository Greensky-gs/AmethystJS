import {
    PreconditionButtonRun,
    PreconditionChatInputRun,
    PreconditionMessageRun,
    PreconditionModalRun
} from '../typings/Precondition';

export class Precondition {
    public readonly name: string;
    public chatInputRun: PreconditionChatInputRun;
    public messageRun: PreconditionMessageRun;
    public buttonRun: PreconditionButtonRun;
    public modalRun: PreconditionModalRun

    constructor(name: string) {
        this.name = name;
    }
    public setChatInputRun(run: PreconditionChatInputRun) {
        this.chatInputRun = run;
        return this;
    }
    public setMessageRun(run: PreconditionMessageRun) {
        this.messageRun = run;
        return this;
    }
    public setButtonRun(run: PreconditionButtonRun) {
        this.buttonRun = run;
        return this;
    }
    public setModalRun(run: PreconditionModalRun) {
        this.modalRun = run;
        return this;
    }
}
