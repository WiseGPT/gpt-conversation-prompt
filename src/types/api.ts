export type APIUsageInfo = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type APIResponseDataError = {
  message: string;
  type: string;
};

export type APIResponseHeaders = {
  // value of `openai-model` header
  model: string;
  // value of `openai-organization` header
  organization: string;
  // value of `openai-version` header
  version: string;
  // value of `x-request-id` header
  requestId: string;
  // value of `openai-processing-ms` header
  processingMs?: number;
};
