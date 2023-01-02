import { AIPersona, Conversation } from "../types";
import { BOT_MENTION, buildMention } from "./mention";

export const STATEMENT_SEPARATOR_TOKEN = "<|endofstatement|>";
const CONVERSATION_FORMAT_PROMPT = `The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. "<@id>" format is used to reference entities in the conversation, where "id" is replaced with message author's unique id. The text "${STATEMENT_SEPARATOR_TOKEN}" is used to separate chat entries and make it easier for you to understand the context:`;
const CURRENT_CONVERSATION_PROMPT = `Continue the conversation, paying very close attention to things Human told you, such as their name, and personal details. Never say "${STATEMENT_SEPARATOR_TOKEN}". Current conversation:`;
const BASIC_EXAMPLE_CONVERSATIONS: Conversation[] = [
  {
    messages: [
      {
        text: "[MESSAGE 1]",
        author: { type: "USER", id: "U01" },
      },
      {
        text: "[RESPONSE TO MESSAGE 1]",
        author: { type: "BOT" },
      },
    ],
  },
  {
    messages: [
      {
        text: `hello ${BOT_MENTION}`,
        author: { type: "USER", id: "U02" },
      },
      {
        text: `hello ${buildMention({
          type: "USER",
          id: "U02",
        })}! how are you?`,
        author: { type: "BOT" },
      },
    ],
  },
];

export type CreateConversationCompletionPromptInput = {
  aiPersona: AIPersona;
  conversation: Conversation;
};

export function createConversationCompletionPrompt({
  aiPersona,
  conversation,
}: CreateConversationCompletionPromptInput): string {
  const exampleConversations =
    aiPersona.exampleConversations.length > 0
      ? aiPersona.exampleConversations
      : BASIC_EXAMPLE_CONVERSATIONS;

  const renderConversation = ({ messages }: Conversation) =>
    messages
      .map(
        (message) =>
          `${buildMention(message.author)}: ${
            message.text
          } ${STATEMENT_SEPARATOR_TOKEN}\n`
      )
      .join("");

  return (
    `Instructions for ${BOT_MENTION}:\n` +
    `Your name is "${aiPersona.name}". You are referenced in conversations as "${BOT_MENTION}".\n` +
    aiPersona.instructions +
    `\n\n${CONVERSATION_FORMAT_PROMPT}\n\n${exampleConversations
      .map(renderConversation)
      .join("\n")}...` +
    `\n\n${CURRENT_CONVERSATION_PROMPT}\n\n` +
    (renderConversation(conversation) + `${BOT_MENTION}: `)
  );
}
