import { OpenAIApi } from "openai";
import {
  ConversationCompleteInput,
  ConversationCompleteOutput,
  ConversationSummaryInput,
  ConversationSummaryOutput,
} from "./conversation-prompt-service.dto";
import { createConversationCompletionPrompt } from "./prompts/create-conversation-completion-prompt";
import { createConversationSummaryPrompt } from "./prompts/create-conversation-summary-prompt";
import { STATEMENT_SEPARATOR_TOKEN } from "./prompts/prompts.constants";

export class ConversationPromptService {
  constructor(private readonly openAIApi: OpenAIApi) {}

  async completion(
    input: ConversationCompleteInput
  ): Promise<ConversationCompleteOutput> {
    const prompt = createConversationCompletionPrompt(input.prompt);

    const { data } = await this.openAIApi.createCompletion({
      ...input.modelConfiguration,
      best_of: 1,
      n: 1,
      echo: false,
      prompt,
    });

    const text = data.choices?.[0]
      .text!.trim()
      .replace(STATEMENT_SEPARATOR_TOKEN, "")
      .trim();

    const {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
    } = data.usage!;

    return { text, usage: { promptTokens, completionTokens, totalTokens } };
  }

  async summary(
    input: ConversationSummaryInput
  ): Promise<ConversationSummaryOutput> {
    const prompt = createConversationSummaryPrompt(input.prompt);

    const { data } = await this.openAIApi.createCompletion({
      ...input.modelConfiguration,
      best_of: 1,
      n: 1,
      echo: false,
      prompt,
    });

    const summary = data.choices?.[0]
      .text!.trim()
      .replace(STATEMENT_SEPARATOR_TOKEN, "")
      .trim();

    const {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
    } = data.usage!;

    return { summary, usage: { promptTokens, completionTokens, totalTokens } };
  }
}
