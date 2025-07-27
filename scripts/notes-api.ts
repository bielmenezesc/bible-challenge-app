import { Note } from "@/types/Note";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function addNote(
  chapterId: string,
  content: string
): Promise<Note> {
  const key = chapterId.replace(/\s+/g, "");
  const newNote: Note = {
    id: Date.now().toString(),
    content,
    createdAt: new Date().toISOString(),
  };

  const stored = await AsyncStorage.getItem(key);
  const existingNotes: Note[] = stored ? JSON.parse(stored) : [];

  const updatedNotes = [...existingNotes, newNote];
  await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));

  return newNote;
}

export async function updateNote(
  chapterId: string,
  noteId: string,
  newContent: string
): Promise<Note | null> {
  const key = chapterId.replace(/\s+/g, "");
  const stored = await AsyncStorage.getItem(key);
  const existingNotes: Note[] = stored ? JSON.parse(stored) : [];

  const updatedNotes = existingNotes.map((note) =>
    note.id === noteId ? { ...note, content: newContent } : note
  );

  await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));

  const updatedNote = updatedNotes.find((note) => note.id === noteId) || null;
  return updatedNote;
}

export async function loadNotes(chapterId: string): Promise<Note[]> {
  const key = chapterId.replace(/\s+/g, "");
  const stored = await AsyncStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export async function deleteNote(
  chapterId: string,
  noteId: string
): Promise<void> {
  const key = chapterId.replace(/\s+/g, "");
  const stored = await AsyncStorage.getItem(key);
  const existingNotes: Note[] = stored ? JSON.parse(stored) : [];

  const updatedNotes = existingNotes.filter((note) => note.id !== noteId);

  await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));
}
