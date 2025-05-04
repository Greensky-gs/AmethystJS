import { AmethystEvent } from "../structures/Event";
import { messageInputRun } from "../utils/messageInputRun";

export default new AmethystEvent('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.content === newMessage.content) return;

    messageInputRun(newMessage)
})