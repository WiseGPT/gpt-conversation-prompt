import { Conversation } from "./conversation";

export type AIPersona = {
  // name of the bot
  name: string;
  // base prompt that defines the personality and output type of the bot
  instructions: string;
  // example conversation for the AI Persona
  exampleConversations: Conversation[];
};
