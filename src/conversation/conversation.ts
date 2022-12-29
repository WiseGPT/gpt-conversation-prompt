import { AIPersona } from "../ai-persona/ai-persona";
import { Message } from "../message/message";

const SEPARATOR_TOKEN = "<|endofstatement|>";

export type Participant = {
  authorId: string;
  shortName: string;
};

export type ConversationContext = {
  participants: Participant[];
  aiPersona: AIPersona;
};

export type CreateConversationCompletionPromptInput = {
  context: ConversationContext;
  /**
   * `messages` starting from oldest
   */
  messages: Message[];
};

export function createConversationCompletionPrompt({
  context: { participants, aiPersona },
  messages,
}: CreateConversationCompletionPromptInput): { prompt: string } {
  const authorIdToParticipant = participants.reduce<
    Record<string, Participant>
  >(
    (curr, participant) => ({ ...curr, [participant.authorId]: participant }),
    {}
  );

  const prompt =
    aiPersona.basePrompt +
    messages
      .map((message) => {
        const messageAuthorId = message.author.id;
        if (
          !(messageAuthorId in authorIdToParticipant) &&
          messageAuthorId !== aiPersona.authorId
        ) {
          throw new Error(`unknown user: '${messageAuthorId}'`);
        }

        return `${
          messageAuthorId === aiPersona.authorId
            ? aiPersona.shortName
            : authorIdToParticipant[messageAuthorId].shortName
        }: ${message.content}`;
      })
      .join(` ${SEPARATOR_TOKEN}\n`) +
    `\n${aiPersona.shortName}: `;

  return { prompt };
}
