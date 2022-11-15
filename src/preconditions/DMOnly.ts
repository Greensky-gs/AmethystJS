import { Precondition } from "../structures/Precondition";
import { commandDeniedCode } from "../typings/Client";

export default new Precondition('DMOnly')
.setChatInputRun(({ interaction }) => {
    if (interaction.guild) return {
        ok: false,
        message: 'Command usable in private messages only',
        isChatInput: true,
        interaction,
        metadata: {
            code: commandDeniedCode.DMOnly
        }
    };
    return {
        ok: true,
        interaction,
        isChatInput: true
    }
})
.setMessageRun(({ message }) => {
    if (message.guild) {
        return  {
            ok: false,
            isChatInput: false,
            channelMessage: message,
            message: "Command usable in private messages only",
            metadata: {
                code: commandDeniedCode.DMOnly
            }
        }
    }
    return {
        ok: true,
        isChatInput: false,
        channelMessage: message
    }
})
