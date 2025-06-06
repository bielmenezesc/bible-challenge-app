export function parseReference(reference: string): {
  book: string;
  chapter: number;
} {
  const match = reference.match(/^([\w\s]+)\s+(\d+)/);
  if (!match) throw new Error("Invalid reference format");
  return {
    book: match[1].trim(),
    chapter: Number(match[2]),
  };
}
