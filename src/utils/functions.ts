import { Message } from 'discord.js';

export const testMessage = ({ content, client }: Message): { valid: boolean; length: number } => {
    const { prefix, mentionWorksAsPrefix, strictPrefix, botName, botNameWorksAsPrefix } = client.configs;
    if (strictPrefix && content.startsWith(prefix)) return { valid: true, length: prefix.length };
    if (!strictPrefix && content.toLowerCase().startsWith(prefix.toLowerCase()))
        return { valid: true, length: prefix.length };
    if (mentionWorksAsPrefix && content.startsWith(`<@${client.user.id}>`))
        return { valid: true, length: `<@${client.user.id}>`.length };
    if (mentionWorksAsPrefix && content.startsWith(`<@!${client.user.id}>`))
        return { valid: true, length: `<@!${client.user.id}`.length };
    if (botNameWorksAsPrefix && botName && content.toLocaleLowerCase().startsWith(botName.toLowerCase()))
        return { valid: true, length: botName.length };

    return { valid: false, length: -1 };
};
