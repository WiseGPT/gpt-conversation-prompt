import { AIPersona, Author, buildMention } from "../../src";
import { createConversationCompletionPrompt } from "../../src/conversation-prompt/create-conversation-completion-prompt";

describe("createConversationCompletionPrompt", () => {
  const authors: Record<string, Author> = {
    bot: { type: "BOT" },
    exampleUser1: { type: "USER", id: "EU01" },
    exampleUser2: { type: "USER", id: "EU02" },
    user1: { type: "USER", id: "U01" },
  };

  it("should work with example conversations", () => {
    const aiPersona: AIPersona = {
      name: "Lenard",
      instructions: "You are helpful.",
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
    };

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
              text: `hello ${buildMention(authors.user1)}! how can I help you?`,
            },
            {
              author: authors.user1,
              text: "can you write me fibonacci function in Typescript?",
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      "Instructions for <@bot>:
      Your name is "Lenard". You are referenced in conversations as "<@bot>".
      You are helpful.

      The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. "<@id>" format is used to reference entities in the conversation, where "id" is replaced with message author's unique id. The text "<|endofstatement|>" is used to separate chat entries and make it easier for you to understand the context:

      <@EU01>: hello <|endofstatement|>
      <@bot>: hello <@EU01>. how may I help you? <|endofstatement|>
      <@EU01>: how is it going? <|endofstatement|>
      <@bot>: it's fine. thanks for asking. how about you? <|endofstatement|>

      <@EU02>: hello, friend. <|endofstatement|>
      <@bot>: hey there! hello to you too. <|endofstatement|>
      ...

      Continue the conversation, paying very close attention to things Human told you, such as their name, and personal details. Never say "<|endofstatement|>". Current conversation:

      <@U01>: hello! <|endofstatement|>
      <@bot>: hello <@U01>! how can I help you? <|endofstatement|>
      <@U01>: can you write me fibonacci function in Typescript? <|endofstatement|>
      <@bot>: "
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
      "Instructions for <@bot>:
      Your name is "Lenard". You are referenced in conversations as "<@bot>".
      You are helpful.

      The conversations are in this format, there can be an arbitrary amount of newlines between chat entries. "<@id>" format is used to reference entities in the conversation, where "id" is replaced with message author's unique id. The text "<|endofstatement|>" is used to separate chat entries and make it easier for you to understand the context:

      <@U01>: [MESSAGE 1] <|endofstatement|>
      <@bot>: [RESPONSE TO MESSAGE 1] <|endofstatement|>

      <@U02>: hello <@bot> <|endofstatement|>
      <@bot>: hello <@U02>! how are you? <|endofstatement|>
      ...

      Continue the conversation, paying very close attention to things Human told you, such as their name, and personal details. Never say "<|endofstatement|>". Current conversation:

      <@U01>: hello! <|endofstatement|>
      <@bot>: hello! how can I help you? <|endofstatement|>
      <@U01>: can you write me fibonacci function in Typescript? <|endofstatement|>
      <@bot>: "
    `);
  });
});
