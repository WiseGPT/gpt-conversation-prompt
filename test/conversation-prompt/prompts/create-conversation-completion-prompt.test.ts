import { AIPersona, Author, BOT_MENTION, buildMention } from "../../../src";
import { createConversationCompletionPrompt } from "../../../src/conversation-prompt/prompts/create-conversation-completion-prompt";

describe("createConversationCompletionPrompt", () => {
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

  describe("with example conversations", () => {
    it("should work without summary", () => {
      expect(
        createConversationCompletionPrompt({
          aiPersona,
          exampleConversations: [
            {
              messages: [
                { text: "hello", author: authors.exampleUser1 },
                {
                  text: `hello ${buildMention(
                    authors.exampleUser1
                  )}. how may I help you?`,
                  author: authors.bot,
                },
                {
                  text: "how is it going?",
                  author: authors.exampleUser1,
                },
                {
                  text: "it's fine. thanks for asking. how about you?",
                  author: authors.bot,
                },
              ],
            },
            {
              messages: [
                {
                  text: "hello, friend.",
                  author: authors.exampleUser2,
                },
                { text: "hey there! hello to you too.", author: authors.bot },
              ],
            },
          ],

          conversation: {
            messages: [
              {
                author: authors.user1,
                text: "hello!",
              },
              {
                author: authors.bot,
                text: `hello ${buildMention(
                  authors.user1
                )}! how can I help you?`,
              },
              {
                author: authors.user1,
                text: "can you write me fibonacci function in Typescript?",
              },
            ],
          },
        })
      ).toMatchInlineSnapshot(`
        "Instructions for <@bot>, this is how you should behave in a conversation, but this is not your personality:
        Your name is "Lenard". You are referenced in conversations as "<@bot>".
        When providing code examples, use triple backticks.

        This is your personality:
        You are a software engineer.

        The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. "<@id>" format is used to reference entities in the conversation, where "id" is replaced with message author's unique id. The text "<|endofstatement|>" is used to separate chat entries and make it easier for you to understand the context:

        <@EU01>: hello <|endofstatement|>
        <@bot>: hello <@EU01>. how may I help you? <|endofstatement|>
        <@EU01>: how is it going? <|endofstatement|>
        <@bot>: it's fine. thanks for asking. how about you? <|endofstatement|>

        <@EU02>: hello, friend. <|endofstatement|>
        <@bot>: hey there! hello to you too. <|endofstatement|>
        ...

        Continue the conversation, paying very close attention to things entities told you; such as their name, and personal details. Never say "<|endofstatement|>". Current conversation:

        <@U01>: hello! <|endofstatement|>
        <@bot>: hello <@U01>! how can I help you? <|endofstatement|>
        <@U01>: can you write me fibonacci function in Typescript? <|endofstatement|>
        <@bot>:"
      `);
    });
  });

  describe("without example conversations", () => {
    it("should work without summary", () => {
      expect(
        createConversationCompletionPrompt({
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
        "Instructions for <@bot>, this is how you should behave in a conversation, but this is not your personality:
        Your name is "Lenard". You are referenced in conversations as "<@bot>".
        When providing code examples, use triple backticks.

        This is your personality:
        You are a software engineer.

        The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. "<@id>" format is used to reference entities in the conversation, where "id" is replaced with message author's unique id. The text "<|endofstatement|>" is used to separate chat entries and make it easier for you to understand the context:

        <@U01>: [MESSAGE 1] <|endofstatement|>
        <@bot>: [RESPONSE TO MESSAGE 1] <|endofstatement|>

        <@U02>: hello <@bot> <|endofstatement|>
        <@bot>: hello <@U02>! how are you? <|endofstatement|>
        ...

        Continue the conversation, paying very close attention to things entities told you; such as their name, and personal details. Never say "<|endofstatement|>". Current conversation:

        <@U01>: hello! <|endofstatement|>
        <@bot>: hello! how can I help you? <|endofstatement|>
        <@U01>: can you write me fibonacci function in Typescript? <|endofstatement|>
        <@bot>:"
      `);
    });

    it("should work with summary", () => {
      expect(
        createConversationCompletionPrompt({
          aiPersona,
          conversation: {
            summary: `${buildMention(
              authors.user1
            )} asked ${BOT_MENTION} whether it knows Typescript.`,
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
        "Instructions for <@bot>, this is how you should behave in a conversation, but this is not your personality:
        Your name is "Lenard". You are referenced in conversations as "<@bot>".
        When providing code examples, use triple backticks.

        This is your personality:
        You are a software engineer.

        The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. "<@id>" format is used to reference entities in the conversation, where "id" is replaced with message author's unique id. The text "<|endofstatement|>" is used to separate chat entries and make it easier for you to understand the context. The conversations start with a "Summary:" which includes a detailed summary of messages in the same conversation. Summary ends with "<|endofstatement|>":

        Summary: [SUMMARY] <|endofstatement|>
        <@U01>: [MESSAGE 1] <|endofstatement|>
        <@bot>: [RESPONSE TO MESSAGE 1] <|endofstatement|>

        Summary: <@U02> is a Software Engineer named Yigitcan. <|endofstatement|>
        <@U02>: hello <@bot> <|endofstatement|>
        <@bot>: hello <@U02>! how are you? <|endofstatement|>
        ...

        Continue the conversation, paying very close attention to things entities told you; such as their name, and personal details. Never say "<|endofstatement|>". Current conversation:

        Summary: <@U01> asked <@bot> whether it knows Typescript. <|endofstatement|>
        <@U01>: hello! <|endofstatement|>
        <@bot>: hello! how can I help you? <|endofstatement|>
        <@U01>: can you write me fibonacci function in Typescript? <|endofstatement|>
        <@bot>:"
      `);
    });
  });
});
