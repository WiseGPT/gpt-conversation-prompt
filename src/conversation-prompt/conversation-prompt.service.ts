import {
  CreateCompletionResponse,
  CreateCompletionResponseUsage,
  OpenAIApi,
} from "openai";
import { ConversationPromptServiceError } from "../error";
import { APIResponseHeaders, APIUsageInfo } from "../types";
import {
  ConversationCompleteInput,
  ConversationCompleteOutput,
  ConversationSummaryInput,
  ConversationSummaryOutput,
  ModelConfiguration,
} from "./conversation-prompt-service.dto";
import { createConversationCompletionPrompt } from "./prompts/create-conversation-completion-prompt";
import { createConversationSummaryPrompt } from "./prompts/create-conversation-summary-prompt";
import { STATEMENT_SEPARATOR_TOKEN } from "./prompts/prompts.constants";

type APIResponseSuccess = { usage?: CreateCompletionResponseUsage };
type APIResponseError = { error: { message: string; type: string } };
type APIResponseData = APIResponseSuccess | APIResponseError;
type APIResponse<T extends APIResponseData> = {
  status: number;
  data: T;
  headers: Record<string, string>;
};

export class ConversationPromptService {
  private static extractAPIUsageInfo(data: APIResponseSuccess): APIUsageInfo {
    const {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
    } = data.usage!;

    return { promptTokens, completionTokens, totalTokens };
  }

  private static extractAPIResponseHeaders(
    headers: APIResponse<any>["headers"]
  ): APIResponseHeaders {
    return {
      model: headers["openai-model"],
      organization: headers["openai-organization"],
      processingMs: headers["openai-processing-ms"]
        ? parseInt(headers["openai-processing-ms"], 10)
        : undefined,
      version: headers["openai-version"],
      requestId: headers["x-request-id"],
    };
  }

  private static isErrorResponse(
    error: any
  ): error is { response: APIResponse<APIResponseError> } {
    return (
      error &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message
    );
  }

  constructor(private readonly openAIApi: OpenAIApi) {}

  async completion(
    input: ConversationCompleteInput
  ): Promise<ConversationCompleteOutput> {
    const prompt = createConversationCompletionPrompt(input.prompt);

    const {
      firstChoice: text,
      usage,
      headers,
    } = await this.makeCompletionRequest({
      prompt,
      modelConfiguration: input.modelConfiguration,
    });

    return { text, usage, headers };
  }

  async summary(
    input: ConversationSummaryInput
  ): Promise<ConversationSummaryOutput> {
    const prompt = createConversationSummaryPrompt(input.prompt);
    const {
      firstChoice: summary,
      usage,
      headers,
    } = await this.makeCompletionRequest({
      prompt,
      modelConfiguration: input.modelConfiguration,
    });

    return { summary, usage, headers };
  }

  private async makeCompletionRequest(input: {
    prompt: string;
    modelConfiguration: ModelConfiguration;
  }) {
    try {
      const { data, headers }: APIResponse<CreateCompletionResponse> =
        await this.openAIApi.createCompletion({
          ...input.modelConfiguration,
          best_of: 1,
          n: 1,
          echo: false,
          prompt: input.prompt,
        });

      const firstChoice = data.choices?.[0]
        .text!.trim()
        .replace(STATEMENT_SEPARATOR_TOKEN, "")
        .trim();

      return {
        firstChoice,
        usage: ConversationPromptService.extractAPIUsageInfo(data),
        headers: ConversationPromptService.extractAPIResponseHeaders(headers),
      };
    } catch (err: unknown) {
      if (ConversationPromptService.isErrorResponse(err)) {
        const { message, type } = err.response.data.error;

        throw new ConversationPromptServiceError(
          err.response.status,
          { message, type },
          ConversationPromptService.extractAPIResponseHeaders(
            err.response.headers
          )
        );
      }

      throw err;
    }
  }
}
