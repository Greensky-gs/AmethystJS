import { AmethystEvent } from "../structures/Event";
import { DebugImportance } from "../typings/Client";
import { generateMessageRegex } from "../utils/functions";

export default new AmethystEvent('messageCreate', ({ client, content }) => {
    const regex = generateMessageRegex(client.configs, client);
    if (regex === 'invalid') return;

    if (!regex.test(content)) return;

    const length: number = content.startsWith(client.configs.prefix) ? client.configs.prefix.length : (content.startsWith(client.configs.botName) && client.configs.botNameWorksAsPrefix) ? client.configs.botName.length : (content.startsWith(`<@${client.user.id}>`) && client.configs.mentionWorksAsPrefix) ? (`<@${client.user.id}>`).length : (content.startsWith(`<@!${client.user.id}>`) && client.configs.mentionWorksAsPrefix) ? (`<@!${client.user.id}>`).length : client.configs.prefix.length;

    const cmdName = content.slice(length);
    const cmd = client.messageCommands.find(x => x.options.name === cmdName.toLowerCase());

    if (!cmd) {
        client.debug(`An user used an unexisting command: ${cmdName}`, DebugImportance.Information);
        return;
    }

    if (cmd.options.preconditions?.length > 0) {
        
    }
})