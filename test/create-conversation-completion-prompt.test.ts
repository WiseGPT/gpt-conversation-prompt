import { AIPersona } from "../src/ai-persona/ai-persona";
import {
  createConversationCompletionPrompt,
  Participant,
} from "../src/conversation/conversation";

describe("createConversationCompletionPrompt", () => {
  it("should output", () => {
    const user: Participant = {
      authorId: "user",
      shortName: "User",
    };

    const aiPersona: AIPersona = {
      authorId: "ai",
      shortName: "Lenard",
      basePrompt: "Your name is Lenard.\n",
    };

    expect(
      createConversationCompletionPrompt({
        context: { aiPersona, participants: [user] },
        messages: [
          { author: { id: user.authorId }, id: "message-1", content: "hello!" },
          {
            author: { id: aiPersona.authorId },
            id: "message-2",
            content: "hello! how can I help you?",
          },
          {
            author: { id: user.authorId },
            id: "message-3",
            content: "can you write me fibonacci in Typescript?",
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "prompt": "Your name is Lenard.
      User: hello! <|endofstatement|>
      Lenard: hello! how can I help you? <|endofstatement|>
      User: can you write me fibonacci in Typescript?
      Lenard: ",
      }
    `);
  });
});
