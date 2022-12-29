# @wisegpt/gpt-conversation-prompt

Types and utility functions to easily generate OpenAI GPT prompts for chatting with the AI.

## Example Usage

```typescript
import { Configuration, OpenAIApi } from "openai";
import { AIPersona, ModelConfiguration, ConversationPromptService } from "@wisegpt/gpt-conversation-prompt";

const aiPersona: AIPersona = {
  name: "wiseGPT",
  instructions: `You are a software engineer.
When providing code examples, use triple backticks.`,
  exampleConversations: [],
};

const modelConfiguration: ModelConfiguration = {
  model: "text-davinci-003",
  max_tokens: 1000,
};

const openAIApi = new OpenAIApi(new Configuration({ apiKey: "<<your-secret>>" }));
const conversationPromptService = new ConversationPromptService(openAIApi);

async function exampleUsage() {
  const { text, usage } = await conversationPromptService.conversationCompletion({
    prompt: {
      conversation: {
        messages: [
          {
            text: "hello",
            author: { type: "USER", id: "user-1" },
          },
          {
            text: "hello, there. how can I help you?",
            author: { type: "BOT" },
          },
          {
            text: "can you write me fibonacci function in a recursive manner in Typescript?",
            author: { type: "USER", id: "user-1" },
          },
        ],
      },
      aiPersona,
    },
    modelConfiguration,
  });

  console.log(JSON.stringify({ text, usage }));
}
```