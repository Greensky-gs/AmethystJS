import {
    PreconditionButtonRun,
    PreconditionChatInputRun,
    PreconditionMessageContextMenuRun,
    PreconditionMessageRun,
    PreconditionModalRun,
    PreconditionUserContextMenuRun
} from '../typings/Precondition';

export class Precondition {
    public readonly name: string;
    public chatInputRun: PreconditionChatInputRun;
    public messageRun: PreconditionMessageRun;
    public buttonRun: PreconditionButtonRun;
    public modalRun: PreconditionModalRun;
    public userContextMenuRun: PreconditionUserContextMenuRun;
    public messageContextMenuRun: PreconditionMessageContextMenuRun;

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
    public setUserContextMenuRun(run: PreconditionUserContextMenuRun) {
        this.userContextMenuRun = run;
        return this;
    }
    public setMessageContextMenuRun(run: PreconditionMessageContextMenuRun) {
        this.messageContextMenuRun = run;
        return this;
    }
}
