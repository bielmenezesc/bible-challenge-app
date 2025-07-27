// types.ts (separado ou junto, dependendo da organização do seu projeto)
export interface BibleBook {
  name: string;
  namePt: string;
  chapters: number;
  testament: "old" | "new";
}

export interface ReadingDay {
  day: number;
  references: string[];
  referencesPt: string[];
  completed: boolean;
}

// Dados dos livros da Bíblia
export const bibleBooks: BibleBook[] = [
  // Old Testament
  { name: "Genesis", namePt: "Gênesis", chapters: 50, testament: "old" },
  { name: "Exodus", namePt: "Êxodo", chapters: 40, testament: "old" },
  { name: "Leviticus", namePt: "Levítico", chapters: 27, testament: "old" },
  { name: "Numbers", namePt: "Números", chapters: 36, testament: "old" },
  {
    name: "Deuteronomy",
    namePt: "Deuteronômio",
    chapters: 34,
    testament: "old",
  },
  { name: "Joshua", namePt: "Josué", chapters: 24, testament: "old" },
  { name: "Judges", namePt: "Juízes", chapters: 21, testament: "old" },
  { name: "Ruth", namePt: "Rute", chapters: 4, testament: "old" },
  { name: "1 Samuel", namePt: "1 Samuel", chapters: 31, testament: "old" },
  { name: "2 Samuel", namePt: "2 Samuel", chapters: 24, testament: "old" },
  { name: "1 Kings", namePt: "1 Reis", chapters: 22, testament: "old" },
  { name: "2 Kings", namePt: "2 Reis", chapters: 25, testament: "old" },
  {
    name: "1 Chronicles",
    namePt: "1 Crônicas",
    chapters: 29,
    testament: "old",
  },
  {
    name: "2 Chronicles",
    namePt: "2 Crônicas",
    chapters: 36,
    testament: "old",
  },
  { name: "Ezra", namePt: "Esdras", chapters: 10, testament: "old" },
  { name: "Nehemiah", namePt: "Neemias", chapters: 13, testament: "old" },
  { name: "Esther", namePt: "Ester", chapters: 10, testament: "old" },
  { name: "Job", namePt: "Jó", chapters: 42, testament: "old" },
  { name: "Psalms", namePt: "Salmos", chapters: 150, testament: "old" },
  { name: "Proverbs", namePt: "Provérbios", chapters: 31, testament: "old" },
  {
    name: "Ecclesiastes",
    namePt: "Eclesiastes",
    chapters: 12,
    testament: "old",
  },
  {
    name: "Song of Solomon",
    namePt: "Cânticos",
    chapters: 8,
    testament: "old",
  },
  { name: "Isaiah", namePt: "Isaías", chapters: 66, testament: "old" },
  { name: "Jeremiah", namePt: "Jeremias", chapters: 52, testament: "old" },
  {
    name: "Lamentations",
    namePt: "Lamentações",
    chapters: 5,
    testament: "old",
  },
  { name: "Ezekiel", namePt: "Ezequiel", chapters: 48, testament: "old" },
  { name: "Daniel", namePt: "Daniel", chapters: 12, testament: "old" },
  { name: "Hosea", namePt: "Oseias", chapters: 14, testament: "old" },
  { name: "Joel", namePt: "Joel", chapters: 3, testament: "old" },
  { name: "Amos", namePt: "Amós", chapters: 9, testament: "old" },
  { name: "Obadiah", namePt: "Obadias", chapters: 1, testament: "old" },
  { name: "Jonah", namePt: "Jonas", chapters: 4, testament: "old" },
  { name: "Micah", namePt: "Miqueias", chapters: 7, testament: "old" },
  { name: "Nahum", namePt: "Naum", chapters: 3, testament: "old" },
  { name: "Habakkuk", namePt: "Habacuque", chapters: 3, testament: "old" },
  { name: "Zephaniah", namePt: "Sofonias", chapters: 3, testament: "old" },
  { name: "Haggai", namePt: "Ageu", chapters: 2, testament: "old" },
  { name: "Zechariah", namePt: "Zacarias", chapters: 14, testament: "old" },
  { name: "Malachi", namePt: "Malaquias", chapters: 4, testament: "old" },

  // New Testament
  { name: "Matthew", namePt: "Mateus", chapters: 28, testament: "new" },
  { name: "Mark", namePt: "Marcos", chapters: 16, testament: "new" },
  { name: "Luke", namePt: "Lucas", chapters: 24, testament: "new" },
  { name: "John", namePt: "João", chapters: 21, testament: "new" },
  { name: "Acts", namePt: "Atos", chapters: 28, testament: "new" },
  { name: "Romans", namePt: "Romanos", chapters: 16, testament: "new" },
  {
    name: "1 Corinthians",
    namePt: "1 Coríntios",
    chapters: 16,
    testament: "new",
  },
  {
    name: "2 Corinthians",
    namePt: "2 Coríntios",
    chapters: 13,
    testament: "new",
  },
  { name: "Galatians", namePt: "Gálatas", chapters: 6, testament: "new" },
  { name: "Ephesians", namePt: "Efésios", chapters: 6, testament: "new" },
  { name: "Philippians", namePt: "Filipenses", chapters: 4, testament: "new" },
  { name: "Colossians", namePt: "Colossenses", chapters: 4, testament: "new" },
  {
    name: "1 Thessalonians",
    namePt: "1 Tessalonicenses",
    chapters: 5,
    testament: "new",
  },
  {
    name: "2 Thessalonians",
    namePt: "2 Tessalonicenses",
    chapters: 3,
    testament: "new",
  },
  { name: "1 Timothy", namePt: "1 Timóteo", chapters: 6, testament: "new" },
  { name: "2 Timothy", namePt: "2 Timóteo", chapters: 4, testament: "new" },
  { name: "Titus", namePt: "Tito", chapters: 3, testament: "new" },
  { name: "Philemon", namePt: "Filemom", chapters: 1, testament: "new" },
  { name: "Hebrews", namePt: "Hebreus", chapters: 13, testament: "new" },
  { name: "James", namePt: "Tiago", chapters: 5, testament: "new" },
  { name: "1 Peter", namePt: "1 Pedro", chapters: 5, testament: "new" },
  { name: "2 Peter", namePt: "2 Pedro", chapters: 3, testament: "new" },
  { name: "1 John", namePt: "1 João", chapters: 5, testament: "new" },
  { name: "2 John", namePt: "2 João", chapters: 1, testament: "new" },
  { name: "3 John", namePt: "3 João", chapters: 1, testament: "new" },
  { name: "Jude", namePt: "Judas", chapters: 1, testament: "new" },
  { name: "Revelation", namePt: "Apocalipse", chapters: 22, testament: "new" },
];

// Total de capítulos
export const totalChapters = bibleBooks.reduce(
  (total, book) => total + book.chapters,
  0
);

// Gerar lista de todas as referências: "Genesis 1", "Genesis 2", ... [EN]
export function getAllChapterReferences(): string[] {
  const references: string[] = [];

  bibleBooks.forEach((book) => {
    for (let i = 1; i <= book.chapters; i++) {
      references.push(`${book.name} ${i}`);
    }
  });

  return references;
}

// Gerar lista de todas as referências: "Gênesis 1", "Gênesis 2", ... [PT]
export function getAllChapterReferencesPT(): string[] {
  const references: string[] = [];

  bibleBooks.forEach((book) => {
    for (let i = 1; i <= book.chapters; i++) {
      references.push(`${book.namePt} ${i}`);
    }
  });

  return references;
}

// Gerar plano de leitura
export function generateReadingPlan(
  days: number,
  planName: string
): ReadingDay[] {
  const allReferences = getAllChapterReferences();
  const allReferencesPt = getAllChapterReferencesPT();

  const totalChapters = allReferences.length;
  const baseChaptersPerDay = Math.floor(totalChapters / days);
  const extraDays = totalChapters % days; // dias que receberão +1 capítulo

  const plan: ReadingDay[] = [];

  let currentIndex = 0;

  for (let day = 1; day <= days; day++) {
    // Adiciona +1 capítulo nos primeiros "extraDays" dias
    const chaptersToday = baseChaptersPerDay + (day <= extraDays ? 1 : 0);

    const dayReferences = allReferences.slice(
      currentIndex,
      currentIndex + chaptersToday
    );
    const dayReferencesPt = allReferencesPt.slice(
      currentIndex,
      currentIndex + chaptersToday
    );

    plan.push({
      day,
      references: dayReferences,
      referencesPt: dayReferencesPt,
      completed: false,
    });

    currentIndex += chaptersToday;
  }

  saveReadingPlanToStorage(plan, planName);

  return plan;
}

export function editReadingPlan(
  existingPlan: ReadingDay[],
  totalDays: number,
  planName: string
): ReadingDay[] {
  const allReferences = getAllChapterReferences();
  const allReferencesPt = getAllChapterReferencesPT();

  // Capítulos que já foram lidos
  const readReferences: string[] = [];
  const readReferencesPt: string[] = [];

  existingPlan.forEach((day) => {
    if (day.completed) {
      readReferences.push(...day.references);
      readReferencesPt.push(...day.referencesPt);
    }
  });

  // Capítulos restantes (não lidos ainda)
  const readCount = readReferences.length;
  const remainingReferences = allReferences.slice(readCount);
  const remainingReferencesPt = allReferencesPt.slice(readCount);

  // Dias já concluídos
  const completedDays = existingPlan.filter((day) => day.completed);
  const remainingDays = totalDays - completedDays.length;

  if (remainingDays <= 0) {
    // Tudo já foi lido ou número de dias inválido
    saveReadingPlanToStorage(completedDays, planName);
    return completedDays;
  }

  // Redistribuição dos capítulos restantes para os novos dias
  const totalRemainingChapters = remainingReferences.length;
  const baseChaptersPerDay = Math.floor(totalRemainingChapters / remainingDays);
  const extraDays = totalRemainingChapters % remainingDays;

  const updatedPlan: ReadingDay[] = [...completedDays];
  let currentIndex = 0;

  for (let i = 1; i <= remainingDays; i++) {
    const chaptersToday = baseChaptersPerDay + (i <= extraDays ? 1 : 0);

    const refs = remainingReferences.slice(
      currentIndex,
      currentIndex + chaptersToday
    );
    const refsPt = remainingReferencesPt.slice(
      currentIndex,
      currentIndex + chaptersToday
    );

    updatedPlan.push({
      day: updatedPlan.length + 1,
      references: refs,
      referencesPt: refsPt,
      completed: false,
    });

    currentIndex += chaptersToday;
  }

  saveReadingPlanToStorage(updatedPlan, planName);
  return updatedPlan;
}

// Capítulo anterior e próximo
export function getAdjacentChapters(reference: string): {
  prev: string | null;
  next: string | null;
} {
  const allReferences = getAllChapterReferences();
  const currentIndex = allReferences.findIndex((ref) => ref === reference);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? allReferences[currentIndex - 1] : null;
  const next =
    currentIndex < allReferences.length - 1
      ? allReferences[currentIndex + 1]
      : null;

  return { prev, next };
}

// Separar o nome do livro e capítulo
export function parseReference(reference: string): {
  book: string;
  chapter: number;
} {
  const match = reference.match(
    /^((?:\d\s)?[A-Za-z]+(?:\s[A-Za-z]+)*)\s(\d+)$/
  );

  if (!match) {
    throw new Error(`Invalid reference format: ${reference}`);
  }

  return {
    book: match[1],
    chapter: Number.parseInt(match[2], 10),
  };
}

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveReadingPlanToStorage(
  plan: ReadingDay[],
  planName: string
) {
  try {
    const key = `readingPlan:${planName}`;
    const jsonValue = JSON.stringify(plan);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Failed to save reading plan", e);
  }
}

export async function updateReadingDayStatus(
  planName: string,
  dayNumber: number,
  completed: boolean
): Promise<void> {
  try {
    const key = `readingPlan:${planName}`;
    const jsonValue = await AsyncStorage.getItem(key);

    if (!jsonValue) {
      console.warn("No reading plan found to update.");
      return;
    }

    const plan: ReadingDay[] = JSON.parse(jsonValue);
    const dayToUpdate = plan.find((d) => d.day === dayNumber);

    if (!dayToUpdate) {
      console.warn(`Day ${dayNumber} not found in the plan.`);
      return;
    }

    dayToUpdate.completed = completed;
    await AsyncStorage.setItem(key, JSON.stringify(plan));
  } catch (e) {
    console.error("Failed to update reading day status", e);
  }
}

export async function loadReadingPlanFromStorage(
  planName: string
): Promise<ReadingDay[] | null> {
  try {
    const key = `readingPlan:${planName}`;
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to load reading plan", e);
    return null;
  }
}

export async function getTodayReading(): Promise<ReadingDay | null> {
  const plan = await loadReadingPlanFromStorage("users-plan-2");

  if (!plan || plan.length === 0) {
    console.warn("No reading plan found.");
    return null;
  }

  const nextDay = plan.find((day) => !day.completed);

  if (!nextDay) {
    console.log("Reading plan is fully completed.");
    return null;
  }

  return nextDay;
}

export async function markDayAsCompleted(day: number): Promise<void> {
  await updateReadingDayStatus("users-plan-2", day, true);
  await saveAsyncStorage("readChapters", []);
  await saveAsyncStorage("currentChapterIndex", 0);
  await saveAsyncStorage("confetti", true);
}

export const saveAsyncStorage = async (
  key: string,
  content: any
): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(content));
};

export const loadAsyncStorage = async (key: string): Promise<any> => {
  const stored = await AsyncStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const deleteReadingPlanFromStorage = async (
  key: string
): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`readingPlan:${key}`);
    await saveAsyncStorage("readChapters", []);
    await saveAsyncStorage("currentChapterIndex", 0);
    await saveAsyncStorage("confetti", false);
  } catch (error) {
    console.error("Erro ao deletar dados do AsyncStorage:", error);
  }
};
