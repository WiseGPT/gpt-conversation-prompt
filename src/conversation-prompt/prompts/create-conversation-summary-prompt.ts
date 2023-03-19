import { STATEMENT_SEPARATOR_TOKEN } from "./prompts.constants";
import { renderAIPersona } from "./render-ai-persona";
import { renderConversation } from "./render-conversation";
import { renderFormatAndExamples } from "./render-format-and-examples";
import { AIPersona, Conversation } from "../../types";

export type CreateConversationSummaryPromptInput = {
  aiPersona: AIPersona;
  conversation: Conversation;
};

const buildPrompt = ({
  hasSummary,
  hasMultipleEntities,
}: {
  hasSummary: boolean;
  hasMultipleEntities: boolean;
}): string => {
  let prompt = "";

  if (hasSummary) {
    prompt +=
      "Summarize the conversation below. Make a detailed summary which only consists of the previous summary and later messages. ";
  } else {
    prompt +=
      "Summarize the conversation below. Make a detailed summary of the existing messages. ";
  }

  prompt += `Do not summarize the instructions or examples. Do not add anything extra or something that was not discussed. Do not repeat details. Pay close attention to the things that entities told you; especially their personal details and code details. `;

  if (hasMultipleEntities) {
    prompt += `You must reference entities in the conversation with the "<@id>" format in the summary to differentiate their personal details and messages. `;
  }

  prompt += `Omit small talk and conversation status. Never say "${STATEMENT_SEPARATOR_TOKEN}":`;

  return prompt;
};

export const createConversationSummaryPrompt = ({
  aiPersona,
  conversation,
}: CreateConversationSummaryPromptInput) => {
  const hasSummary = !!conversation.summary;
  const participantCount = conversation.messages.reduce(
    (set, { author }) => (author.type !== "BOT" ? set.add(author.id) : set),
    new Set<string>()
  ).size;
  const prompt = buildPrompt({
    hasSummary,
    hasMultipleEntities: participantCount > 1,
  });

  return (
    renderAIPersona(aiPersona) +
    `\n\n${renderFormatAndExamples({
      hasSummary,
    })}` +
    `\n\n${prompt}\n\n` +
    (renderConversation(conversation) + `...\nSummary:`)
  );
};
