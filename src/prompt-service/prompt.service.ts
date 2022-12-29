import { OpenAIApi } from "openai";
import { createConversationCompletionPrompt } from "./create-conversation-completion-prompt";
import { STATEMENT_SEPARATOR_TOKEN } from "./prompt.constants";
import {
  ConversationCompleteInput,
  ConversationCompleteOutput,
} from "./prompt.dto";

export class PromptService {
  constructor(private readonly openAIApi: OpenAIApi) {}

  async conversationCompletion(
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
      .replace(STATEMENT_SEPARATOR_TOKEN, "");

    const {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
    } = data.usage!;

    return { text, usage: { promptTokens, completionTokens, totalTokens } };
  }
}
