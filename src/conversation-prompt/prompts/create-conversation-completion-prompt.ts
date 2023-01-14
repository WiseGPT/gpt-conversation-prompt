import { STATEMENT_SEPARATOR_TOKEN } from "./prompts.constants";
import { renderAIPersona } from "./render-ai-persona";
import { renderConversation } from "./render-conversation";
import { renderFormatAndExamples } from "./render-format-and-examples";
import { AIPersona, Conversation } from "../../types";
import { BOT_MENTION } from "../mention";

const CURRENT_CONVERSATION_PROMPT = `Continue the conversation, paying very close attention to things entities told you; such as their name, and personal details. Never say "${STATEMENT_SEPARATOR_TOKEN}". Current conversation:`;

export type CreateConversationCompletionPromptInput = {
  aiPersona: AIPersona;
  exampleConversations?: Conversation[];
  conversation: Conversation;
};

export function createConversationCompletionPrompt({
  aiPersona,
  conversation,
  exampleConversations,
}: CreateConversationCompletionPromptInput): string {
  const hasSummary = !!conversation.summary;

  return (
    renderAIPersona(aiPersona) +
    `\n${renderFormatAndExamples({
      hasSummary,
      exampleConversations,
    })}` +
    `\n\n${CURRENT_CONVERSATION_PROMPT}\n\n` +
    (renderConversation(conversation) + `${BOT_MENTION}:`)
  );
}
