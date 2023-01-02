import { CreateCompletionRequest } from "openai";
import { AIPersona, Conversation } from "../types";

export type ModelConfiguration = Pick<
  CreateCompletionRequest,
  | "model"
  | "max_tokens"
  | "temperature"
  | "top_p"
  | "n"
  | "presence_penalty"
  | "frequency_penalty"
>;

export type ConversationCompleteInput = {
  // prompt generation related details
  prompt: {
    aiPersona: AIPersona;
    conversation: Conversation;
    exampleConversations?: Conversation[];
  };
  modelConfiguration: ModelConfiguration;
};

export type ConversationCompleteOutput = {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

export type ConversationSummaryInput = {
  // prompt generation related details
  prompt: {
    aiPersona: AIPersona;
    conversation: Conversation;
  };
  modelConfiguration: ModelConfiguration;
};

export type ConversationSummaryOutput = {
  summary: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};
