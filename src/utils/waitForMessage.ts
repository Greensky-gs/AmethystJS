import { Message, Partials } from 'discord.js';
import { waitForMessageType } from '../typings/Client';

export const waitForMessage = ({
    channel,
    user,
    time = 120000,
    whoCanReply = 'useronly'
}: waitForMessageType): Promise<Message> => {
    const { intents, partials } = channel.client.options;
    if (
        !((channel.guild && intents.has('GuildMessages')) || intents.has('Guilds')) ||
        !(!channel.guild && !intents.has('DirectMessages')) ||
        !intents.has('MessageContent')
    ) {
        throw new Error(
            'Missing intents to use waitForMessage(). You need Guilds, GuildMessages, DirectMessages (dependent of the server) and MessageContent'
        );
    }
    if (!partials.includes(Partials.Channel) || !partials.includes(Partials.Message)) {
        throw new Error('Missing partials to use waitForMessage(). You need Channel and Message partials');
    }

    return new Promise(async (resolve, reject) => {
        channel
            .createMessageCollector({
                time,
                filter: (msg) => {
                    let valid = true;
                    switch (whoCanReply) {
                        case 'everyoneexceptuser':
                            if (msg.author.id === user.id) valid = false;
                            break;
                        case 'useronly':
                            if (msg.author.id !== user.id) valid = false;
                            break;
                    }
                    return valid;
                },
                max: 1
            })
            .on('collect', (msg) => {
                resolve(msg);
            })
            .once('end', (c, reason) => {
                if (c.size === 0) reject(reason);
            });
    });
};
