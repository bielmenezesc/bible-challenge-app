// types.ts
export type BiblePassage = {
  reference: string;
  content: string;
  copyright?: string;
  passages: string[];
  verses: [];
};

export type BibleChapter = {
  book: string;
  chapter: number;
  reference: string;
  content: string;
  verses: [];
};
