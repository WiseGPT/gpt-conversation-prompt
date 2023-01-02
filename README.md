# @wisegpt/gpt-conversation-prompt

Types and utility functions to easily generate OpenAI GPT prompts for chatting with the AI.

## Example Usage

```typescript
import { Configuration, OpenAIApi } from "openai";
import { AIPersona, ModelConfiguration, ConversationPromptService } from "@wisegpt/gpt-conversation-prompt";

const aiPersona: AIPersona = {
  name: "WiseGPT",
  instructions: `When providing code examples, use triple backticks.`,
  personality: `You are a software engineer.`,
};

const modelConfiguration: ModelConfiguration = {
  model: "text-davinci-003",
  max_tokens: 1000,
};

const openAIApi = new OpenAIApi(new Configuration({ apiKey: "<<your-secret>>" }));
const conversationPromptService = new ConversationPromptService(openAIApi);

async function exampleUsage() {
  const { text, usage } = await conversationPromptService.completion({
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

## Detailed Example Usage
Below is an example usage which includes summary and re-using the summarized conversation to keeping the conversation going and summarizing again.

```typescript
import { Configuration, OpenAIApi } from "openai";
import { AIPersona, ModelConfiguration, ConversationPromptService, Author, Conversation } from "@wisegpt/gpt-conversation-prompt";

const aiPersona: AIPersona = {
  name: "WiseGPT",
  instructions: `When providing code examples, use triple backticks.`,
  personality: `You are a software engineer.`,
};

const modelConfiguration: ModelConfiguration = {
  model: "text-davinci-003",
  max_tokens: 1000,
};

const openAIApi = new OpenAIApi(new Configuration({ apiKey: "<<your-secret>>" }));
const conversationPromptService = new ConversationPromptService(openAIApi);

async function exampleUsage() {
  const authors: Record<string, Author> = {
    user1: { type: "USER", id: "EU01" },
    user2: { type: "USER", id: "EU02" },
  };

  const conversation1: Conversation = {
    messages: [
      {
        text: "My name is Yigitcan.",
        author: authors.user1,
      },
      {
        text: "My name is Tolga.",
        author: authors.user2,
      },
    ],
  };

  const botResponse1 = await conversationPromptService.completion({
    prompt: { conversation: conversation1, aiPersona },
    modelConfiguration,
  });

  console.log(JSON.stringify({ botResponse1 }));

  // add bots response to the conversation
  conversation1.messages.push({
    text: botResponse1.text,
    author: { type: "BOT" },
  });

  const summaryResponse1 = await conversationPromptService.summary({
    prompt: { conversation: conversation1, aiPersona },
    modelConfiguration,
  });

  console.log(JSON.stringify({ summaryResponse1 }));

  // create a whole new conversation with the summary and a new message
  const conversation2 = {
    summary: summaryResponse1.summary,
    messages: [
      {
        text: "what is my name? and what is the capital of Turkey?",
        author: authors.user1,
      },
    ],
  };

  const botResponse2 = await conversationPromptService.completion({
    prompt: { conversation: conversation2, aiPersona },
    modelConfiguration,
  });

  console.log(JSON.stringify({ botResponse2 }));

  // add bots response to the conversation
  conversation2.messages.push({
    text: botResponse1.text,
    author: { type: "BOT" },
  });

  const summaryResponse2 = await conversationPromptService.summary({
    prompt: { conversation: conversation2, aiPersona },
    modelConfiguration,
  });

  console.log(JSON.stringify({ summaryResponse2 }));
}

exampleUsage().catch((err) => {
  console.error(err);
  process.exit(1);
});
```