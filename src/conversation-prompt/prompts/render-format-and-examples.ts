import { STATEMENT_SEPARATOR_TOKEN } from "./prompts.constants";
import { renderConversation } from "./render-conversation";
import { Conversation } from "../../types";
import { BOT_MENTION, buildMention } from "../mention";

const CONVERSATION_FORMAT = `The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. "<@id>" format is used to reference entities in the conversation, where "id" is replaced with message author's unique id. The text "${STATEMENT_SEPARATOR_TOKEN}" is used to separate chat entries and make it easier for you to understand the context:`;
const CONVERSATION_FORMAT_WITH_EXAMPLE = `The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. "<@id>" format is used to reference entities in the conversation, where "id" is replaced with message author's unique id. The text "${STATEMENT_SEPARATOR_TOKEN}" is used to separate chat entries and make it easier for you to understand the context. The conversations start with a "Summary:" which includes a detailed summary of messages in the same conversation. Summary ends with "${STATEMENT_SEPARATOR_TOKEN}":`;

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
const BASIC_EXAMPLE_CONVERSATIONS_WITH_SUMMARY: Conversation[] = [
  { ...BASIC_EXAMPLE_CONVERSATIONS[0], summary: "[SUMMARY]" },
  {
    ...BASIC_EXAMPLE_CONVERSATIONS[1],
    summary: `${buildMention({
      type: "USER",
      id: "U02",
    })} is a Software Engineer named Yigitcan.`,
  },
];

export const renderFormatAndExamples = ({
  hasSummary,
  exampleConversations,
}: {
  hasSummary: boolean;
  exampleConversations?: Conversation[];
}) => {
  const conversations =
    Array.isArray(exampleConversations) && exampleConversations.length > 0
      ? exampleConversations
      : hasSummary
      ? BASIC_EXAMPLE_CONVERSATIONS_WITH_SUMMARY
      : BASIC_EXAMPLE_CONVERSATIONS;

  return `${
    hasSummary ? CONVERSATION_FORMAT_WITH_EXAMPLE : CONVERSATION_FORMAT
  }\n\n${conversations.map(renderConversation).join("\n")}...`;
};
