import { ChatCompletionRequestMessage } from "openai";
import { renderAIPersona } from "./render-ai-persona";
import { renderConversationForChat } from "./render-conversation-for-chat";
import { AIPersona, Conversation } from "../../types";

const CONVERSATION_SUMMARY_SUFFIX = `The conversations starts with a detailed summary of a previous conversation. While answering questions, take this summary into account. Summary:`;

export type CreateConversationChatCompletionPromptInput = {
  aiPersona: AIPersona;
  conversation: Conversation;
};

export function createConversationChatCompletionPrompt({
  aiPersona,
  conversation,
}: CreateConversationChatCompletionPromptInput): Array<ChatCompletionRequestMessage> {
  const systemMessage = {
    role: "system" as const,
    content: renderAIPersona(aiPersona),
  };

  if (conversation.summary) {
    systemMessage.content += `\n\n${CONVERSATION_SUMMARY_SUFFIX} ${conversation.summary}`;
  }

  return [systemMessage, ...renderConversationForChat(conversation)];
}
