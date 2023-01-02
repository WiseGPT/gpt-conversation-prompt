import { AIPersona, Author, BOT_MENTION, buildMention } from "../../../src";
import { createConversationSummaryPrompt } from "../../../src/conversation-prompt/prompts/create-conversation-summary-prompt";

describe("createConversationSummaryPrompt()", () => {
  const aiPersona: AIPersona = {
    name: "Lenard",
    instructions: `When providing code examples, use triple backticks.`,
    personality: `You are a software engineer.`,
  };
  const authors: Record<string, Author> = {
    bot: { type: "BOT" },
    user1: { type: "USER", id: "U01" },
  };

  it("should summarize without already existing summary", () => {
    expect(
      createConversationSummaryPrompt({
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

      Summarize the conversation below. Make a detailed summary of the existing messages. Do not summarize the instructions or examples. Do not add anything extra or something that was not discussed. Do not repeat details. Pay close attention to the things that entities told you; especially their personal details and code details. Omit small talk and conversation status. Never say "<|endofstatement|>":

      <@U01>: hello! <|endofstatement|>
      <@bot>: hello! how can I help you? <|endofstatement|>
      <@U01>: can you write me fibonacci function in Typescript? <|endofstatement|>
      ...
      Summary:"
    `);
  });

  it("should summarize with already existing summary", () => {
    expect(
      createConversationSummaryPrompt({
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

      Summarize the conversation below. Make a detailed summary which only consists of the previous summary and later messages. Do not summarize the instructions or examples. Do not add anything extra or something that was not discussed. Do not repeat details. Pay close attention to the things that entities told you; especially their personal details and code details. Omit small talk and conversation status. Never say "<|endofstatement|>":

      Summary: <@U01> asked <@bot> whether it knows Typescript. <|endofstatement|>
      <@U01>: hello! <|endofstatement|>
      <@bot>: hello! how can I help you? <|endofstatement|>
      <@U01>: can you write me fibonacci function in Typescript? <|endofstatement|>
      ...
      Summary:"
    `);
  });
});
