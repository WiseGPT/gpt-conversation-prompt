import { Author } from "../types";

export const ASSISTANT_MENTION = "<@assistant>";

export const buildMention = (author: Author): string => {
  switch (author.type) {
    case "BOT":
      return ASSISTANT_MENTION;
    case "USER":
      return `<@${author.id}>`;
    default:
      throw new Error(`unknown type of author: '${JSON.stringify(author)}'`);
  }
};
