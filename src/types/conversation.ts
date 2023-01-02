import { Message } from "./message";

export type Conversation = {
  /**
   * `summary` of prior conversation
   */
  summary?: string;
  /**
   * `messages` which were send after the last summary. ordered from the oldest
   */
  messages: Message[];
};
