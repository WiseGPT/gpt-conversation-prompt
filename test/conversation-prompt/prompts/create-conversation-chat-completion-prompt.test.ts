import {
  AIPersona,
  Author,
  ASSISTANT_MENTION,
  buildMention,
} from "../../../src";
import { createConversationChatCompletionPrompt } from "../../../src/conversation-prompt/prompts/create-conversation-chat-completion-prompt";

describe("createConversationChatCompletionPrompt", () => {
  const aiPersona: AIPersona = {
    name: "Lenard",
    instructions: `When providing code examples, use triple backticks.`,
    personality: `You are a software engineer.`,
  };
  const authors: Record<string, Author> = {
    bot: { type: "BOT" },
    exampleUser1: { type: "USER", id: "EU01" },
    exampleUser2: { type: "USER", id: "EU02" },
    user1: { type: "USER", id: "U01" },
  };

  it("should work without summary", () => {
    expect(
      createConversationChatCompletionPrompt({
        aiPersona,
        conversation: {
          messages: [
            {
              author: authors.user1,
              text: "hello!",
            },
            {
              author: authors.bot,
              text: "hello! how can I help you?",
            },
            {
              author: authors.user1,
              text: "can you write me fibonacci function in Typescript?",
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "content": "Instructions for <@assistant>, this is how you should behave in a conversation, but this is not your personality:
      Your name is "Lenard". You are referenced in conversations as "<@assistant>".
      When providing code examples, use triple backticks.

      This is your personality:
      You are a software engineer.",
          "role": "system",
        },
        {
          "content": "hello!",
          "name": "U01",
          "role": "user",
        },
        {
          "content": "hello! how can I help you?",
          "name": "assistant",
          "role": "assistant",
        },
        {
          "content": "can you write me fibonacci function in Typescript?",
          "name": "U01",
          "role": "user",
        },
      ]
    `);
  });

  it("should work with summary", () => {
    expect(
      createConversationChatCompletionPrompt({
        aiPersona,
        conversation: {
          summary: `${buildMention(
            authors.user1
          )} asked ${ASSISTANT_MENTION} whether it knows Typescript.`,
          messages: [
            {
              author: authors.user1,
              text: "hello!",
            },
            {
              author: authors.bot,
              text: "hello! how can I help you?",
            },
            {
              author: authors.user1,
              text: "can you write me fibonacci function in Typescript?",
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "content": "Instructions for <@assistant>, this is how you should behave in a conversation, but this is not your personality:
      Your name is "Lenard". You are referenced in conversations as "<@assistant>".
      When providing code examples, use triple backticks.

      This is your personality:
      You are a software engineer.

      The conversations starts with a detailed summary of a previous conversation. While answering questions, take this summary into account. Summary: <@U01> asked <@assistant> whether it knows Typescript.",
          "role": "system",
        },
        {
          "content": "hello!",
          "name": "U01",
          "role": "user",
        },
        {
          "content": "hello! how can I help you?",
          "name": "assistant",
          "role": "assistant",
        },
        {
          "content": "can you write me fibonacci function in Typescript?",
          "name": "U01",
          "role": "user",
        },
      ]
    `);
  });
});
