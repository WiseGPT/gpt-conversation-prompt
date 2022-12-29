export type Author =
  // author is the bot, not external user
  | { type: "BOT" }
  // author of the message is an external user
  | {
      type: "USER";
      id: string;
    };

export type Message = {
  // the text body of the message
  text: string;
  // who authored the message
  author: Author;
};
