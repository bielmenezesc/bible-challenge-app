// bible-service.ts
import { parseReference } from "./bible-data";
import type { BibleChapter, BiblePassage } from "./types";

const passageCache = new Map<string, BiblePassage>();

export async function fetchBiblePassage(
  reference: string
): Promise<BiblePassage> {
  if (passageCache.has(reference)) {
    return passageCache.get(reference)!;
  }

  console.log(reference);

  try {
    const url = `https://bible-api.com/${encodeURIComponent(
      reference
    )}?translation=almeida`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro ao buscar passagem: ${response.statusText}`);
    }

    const data = await response.json();

    const passage: BiblePassage = {
      reference: data.reference || reference,
      content: data.text?.trim() || "",
      copyright: data.copyright || "Fonte: bible-api.com",
      passages: [data.text?.trim() || ""],
      verses: data.verses,
    };

    passageCache.set(reference, passage);
    return passage;
  } catch (error) {
    console.error("Erro ao buscar passagem:", error);
    throw error;
  }
}

export async function fetchChapter(reference: string): Promise<BibleChapter> {
  const passage = await fetchBiblePassage(reference);
  const { book, chapter } = parseReference(reference);

  return {
    book,
    chapter,
    reference: passage.reference,
    content: passage.passages[0] || "",
    verses: passage.verses,
  };
}

export async function fetchMultipleChapters(
  references: string[]
): Promise<BibleChapter[]> {
  return Promise.all(references.map((ref) => fetchChapter(ref)));
}
