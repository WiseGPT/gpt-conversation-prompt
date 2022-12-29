import { Message } from "./message";

export type Conversation = {
  /**
   * `messages` starting from oldest
   */
  messages: Message[];
};
