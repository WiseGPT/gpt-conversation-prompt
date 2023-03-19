import { AIPersona } from "../../types";
import { ASSISTANT_MENTION } from "../mention";

export const renderAIPersona = (aiPersona: AIPersona): string =>
  `Instructions for ${ASSISTANT_MENTION}, this is how you should behave in a conversation, but this is not your personality:\n` +
  `Your name is "${aiPersona.name}". You are referenced in conversations as "${ASSISTANT_MENTION}".\n` +
  aiPersona.instructions +
  `\n\nThis is your personality:\n` +
  aiPersona.personality;
