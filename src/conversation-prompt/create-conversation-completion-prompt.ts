import { AIPersona, Conversation } from "../types";
import { STATEMENT_SEPARATOR_TOKEN } from "./prompt.constants";

const CONVERSATION_FORMAT_PROMPT = `The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. The text "${STATEMENT_SEPARATOR_TOKEN}" is used to separate chat entries and make it easier for you to understand the context:`;
const CURRENT_CONVERSATION_PROMPT = `Continue the conversation, paying very close attention to things Human told you, such as their name, and personal details. Never say "${STATEMENT_SEPARATOR_TOKEN}". Current conversation:`;
const BASIC_EXAMPLE_CONVERSATIONS: Conversation[] = [
  {
    messages: [
      {
        text: "[MESSAGE 1]",
        author: { type: "USER", id: "user-1" },
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
        text: "[MESSAGE 2]",
        author: { type: "USER", id: "user-2" },
      },
      {
        text: "[RESPONSE TO MESSAGE 2]",
        author: { type: "BOT" },
      },
    ],
  },
];

export type CreateConversationCompletionPromptInput = {
  aiPersona: AIPersona;
  conversation: Conversation;
};

const createAuthorNameGetter = () => {
  const authorIdToHumanId = new Map<string, number>();
  let currHumanId = 0;

  return {
    get(authorId: string): string {
      let humanId: number;

      if (authorIdToHumanId.has(authorId)) {
        humanId = authorIdToHumanId.get(authorId)!;
      } else {
        humanId = ++currHumanId;
        authorIdToHumanId.set(authorId, humanId);
      }

      return `Human${humanId}`;
    },
  };
};

export function createConversationCompletionPrompt({
  aiPersona,
  conversation,
}: CreateConversationCompletionPromptInput): string {
  const authorNameGetter = createAuthorNameGetter();
  const exampleConversations =
    aiPersona.exampleConversations.length > 0
      ? aiPersona.exampleConversations
      : BASIC_EXAMPLE_CONVERSATIONS;

  const renderConversation = ({ messages }: Conversation) =>
    messages
      .map((message) => {
        const name =
          message.author.type === "BOT"
            ? aiPersona.name
            : authorNameGetter.get(message.author.id);

        return `${name}: ${message.text} ${STATEMENT_SEPARATOR_TOKEN}\n`;
      })
      .join("");

  return (
    `Instructions for ${aiPersona.name}:\n` +
    aiPersona.instructions +
    `\n\n${CONVERSATION_FORMAT_PROMPT}\n\n${exampleConversations
      .map(renderConversation)
      .join("\n")}...` +
    `\n\n${CURRENT_CONVERSATION_PROMPT}\n\n` +
    (renderConversation(conversation) + `${aiPersona.name}: `)
  );
}
