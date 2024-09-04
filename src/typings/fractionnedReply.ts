import { EmbedBuilder, Message, MessageMentionOptions, RepliableInteraction, TextChannel } from 'discord.js';

export type fractionnedReplyType = 'message' | 'interaction';

export type fractionnedReplyMessageResolvable = TextChannel | Message<true>;
export type fractionnedReplyReply<T extends fractionnedReplyType> = T extends 'message'
    ? { resolvable: fractionnedReplyMessageResolvable }
    : T extends 'interaction'
      ? { interaction: RepliableInteraction }
      : never;
export type fractionnedReplyContent = {
    content?: string;
    ephemeral?: boolean;
    embeds?: EmbedBuilder[];
    allowedMentions?: MessageMentionOptions;
};
export type fractionnedReplyCallback = () => unknown;

export type fractionnedReplyOptions<Type extends fractionnedReplyType> = {
    type: Type;
    delay: number;
    contents: fractionnedReplyContent[];
    joiner?: string;
} & fractionnedReplyReply<Type>;
export type fractionnedReplyReference<Type extends fractionnedReplyType> = Type extends 'message'
    ? Message<true>
    : Type extends 'interaction'
      ? RepliableInteraction
      : never;
