import { Author } from "../types";

export const BOT_MENTION = "<@bot>";

export const buildMention = (author: Author): string => {
  switch (author.type) {
    case "BOT":
      return BOT_MENTION;
    case "USER":
      return `<@${author.id}>`;
    default:
      throw new Error(`unknown type of author: '${JSON.stringify(author)}'`);
  }
};
