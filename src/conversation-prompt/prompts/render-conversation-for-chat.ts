import { ChatCompletionRequestMessage } from "openai";
import { Conversation } from "../../types";
import { buildMention } from "../mention";

export const renderConversationForChat = ({
  messages,
}: Conversation): Array<ChatCompletionRequestMessage> => {
  return messages.map((message): ChatCompletionRequestMessage => {
    const author = message.author;

    return {
      role: author.type === "BOT" ? "assistant" : "user",
      name: buildMention(author).replace(/[<>@]/g, ""),
      content: message.text,
    };
  });
};
