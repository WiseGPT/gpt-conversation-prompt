import { AIPersona } from "../../src";
import { createConversationCompletionPrompt } from "../../src/conversation-prompt/create-conversation-completion-prompt";

describe("createConversationCompletionPrompt", () => {
  it("should work with example conversations", () => {
    const aiPersona: AIPersona = {
      name: "Lenard",
      instructions: "You are helpful.",
      exampleConversations: [
        {
          messages: [
            { text: "hello", author: { type: "USER", id: "e-user-1" } },
            { text: "hello. how may I help you?", author: { type: "BOT" } },
            {
              text: "how is it going?",
              author: { type: "USER", id: "e-user-1" },
            },
            {
              text: "it's fine. thanks for asking. how about you?",
              author: { type: "BOT" },
            },
          ],
        },
        {
          messages: [
            {
              text: "hello, friend.",
              author: { type: "USER", id: "e-user-2" },
            },
            { text: "hey there! hello to you too.", author: { type: "BOT" } },
          ],
        },
      ],
    };

    expect(
      createConversationCompletionPrompt({
        aiPersona,
        conversation: {
          messages: [
            {
              author: { type: "USER", id: "user-1" },
              text: "hello!",
            },
            {
              author: { type: "BOT" },
              text: "hello! how can I help you?",
            },
            {
              author: { type: "USER", id: "user-1" },
              text: "can you write me fibonacci function in Typescript?",
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      "Instructions for Lenard:
      You are helpful.

      The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. The text "<|endofstatement|>" is used to separate chat entries and make it easier for you to understand the context:

      Human1: hello <|endofstatement|>
      Lenard: hello. how may I help you? <|endofstatement|>
      Human1: how is it going? <|endofstatement|>
      Lenard: it's fine. thanks for asking. how about you? <|endofstatement|>

      Human2: hello, friend. <|endofstatement|>
      Lenard: hey there! hello to you too. <|endofstatement|>
      ...

      Continue the conversation, paying very close attention to things Human told you, such as their name, and personal details. Never say "<|endofstatement|>". Current conversation:

      Human3: hello! <|endofstatement|>
      Lenard: hello! how can I help you? <|endofstatement|>
      Human3: can you write me fibonacci function in Typescript? <|endofstatement|>
      Lenard: "
    `);
  });

  it("should work without example conversations", () => {
    const aiPersona: AIPersona = {
      name: "Lenard",
      instructions: "You are helpful.",
      exampleConversations: [],
    };

    expect(
      createConversationCompletionPrompt({
        aiPersona,
        conversation: {
          messages: [
            {
              author: { type: "USER", id: "user-1" },
              text: "hello!",
            },
            {
              author: { type: "BOT" },
              text: "hello! how can I help you?",
            },
            {
              author: { type: "USER", id: "user-1" },
              text: "can you write me fibonacci function in Typescript?",
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      "Instructions for Lenard:
      You are helpful.

      The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. The text "<|endofstatement|>" is used to separate chat entries and make it easier for you to understand the context:

      Human1: [MESSAGE 1] <|endofstatement|>
      Lenard: [RESPONSE TO MESSAGE 1] <|endofstatement|>

      Human2: [MESSAGE 2] <|endofstatement|>
      Lenard: [RESPONSE TO MESSAGE 2] <|endofstatement|>
      ...

      Continue the conversation, paying very close attention to things Human told you, such as their name, and personal details. Never say "<|endofstatement|>". Current conversation:

      Human1: hello! <|endofstatement|>
      Lenard: hello! how can I help you? <|endofstatement|>
      Human1: can you write me fibonacci function in Typescript? <|endofstatement|>
      Lenard: "
    `);
  });
});
