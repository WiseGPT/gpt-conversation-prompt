import { APIResponseDataError, APIResponseHeaders } from "../types";

export class ConversationPromptServiceError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly error: APIResponseDataError,
    public readonly headers: APIResponseHeaders
  ) {
    super(
      `API responded with status '${statusCode}' and message: '${error.message}'`
    );
    this.name = "ConversationPromptServiceError";
  }
}
