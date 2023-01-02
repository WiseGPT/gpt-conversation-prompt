import { Conversation } from "../../types";
import { buildMention } from "../mention";
import { STATEMENT_SEPARATOR_TOKEN } from "./prompts.constants";

export const renderConversation = ({ summary, messages }: Conversation) => {
  const summaryText = summary
    ? `Summary: ${summary} ${STATEMENT_SEPARATOR_TOKEN}\n`
    : "";

  return (
    summaryText +
    messages
      .map(
        (message) =>
          `${buildMention(message.author)}: ${
            message.text
          } ${STATEMENT_SEPARATOR_TOKEN}\n`
      )
      .join("")
  );
};
