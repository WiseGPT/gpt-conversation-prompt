export type Author = {
  id: string;
};

export type Message = {
  id: string;
  content: string;
  author: Author;
};
