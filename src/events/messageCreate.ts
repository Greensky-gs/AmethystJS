import { AmethystEvent } from "../structures/Event";
import { generateMessageRegex } from "../utils/functions";

export default new AmethystEvent('messageCreate', ({ client, content }) => {
    const regex = generateMessageRegex(client.configs, client);
    if (regex === 'invalid') return;

    if (!regex.test(content)) return;

    
})