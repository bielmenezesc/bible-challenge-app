// TodayReadingScreen.tsx

import { darkTheme, lightTheme } from "@/constants/Colors";
import { large, medium, small } from "@/constants/TextSizes";
import ThemeContext from "@/context/ThemeContext";
import { getTodayReading, updateReadingDayStatus } from "@/scripts/bible-api";
import { fetchChapter } from "@/scripts/bible-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar, Button, ProgressBar } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";

type BibleChapter = {
  reference: string;
  content: string;
  verses: [];
};

type ReadingDay = {
  day: number;
  completed: boolean;
  references: string[];
  referencesPt: string[];
};

type Note = {
  id: string;
  content: string;
  createdAt: string; // ISO string
};

export default function TodayReadingScreen() {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState<"reading" | "notes">("reading");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayReading, setTodayReading] = useState<ReadingDay | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState<BibleChapter | null>(
    null
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [planName, setPlanName] = useState("365 days challenge");
  const [readChapters, setReadChapters] = useState([]);
  const { theme, textSize } = useContext(ThemeContext);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const colors = theme === "dark" ? darkTheme : lightTheme;
  const textSizes =
    textSize === "small" ? small : textSize === "large" ? large : medium;

  const styles = createStyles(colors, textSizes);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const reading = await getTodayReading();
          setTodayReading(reading);

          const loadedReadChapters = await loadAsyncStorage("readChapters");
          setReadChapters(loadedReadChapters);

          const loadedCurrentChapterIndex = await loadAsyncStorage(
            "currentChapterIndex"
          );
          setCurrentChapterIndex(loadedCurrentChapterIndex);

          // quando clicar em marcar como completo tem que resetar todos essas variaveis no assync storage
          const chapter = await fetchChapter(
            reading.references[loadedCurrentChapterIndex]
          );
          setCurrentChapter(chapter);

          const loadedNotes = await loadNotes(chapter.reference);
          setNotes(loadedNotes);

          // Dentro do fetchData
          const refPt = reading.referencesPt[loadedCurrentChapterIndex];

          markChapterAsRead(refPt);

          setLoading(false);
        } catch (e) {
          setError("Failed to load reading.");
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const markChapterAsRead = async (refPt: string) => {
    setReadChapters((prev) => {
      if (!prev.includes(refPt)) {
        const updated = [...prev, refPt];
        saveAsyncStorage("readChapters", updated);
        return updated;
      }
      return prev;
    });
  };

  const goToNextChapter = async () => {
    if (!todayReading) return;

    const nextIndex = currentChapterIndex + 1;
    if (nextIndex < todayReading.references.length) {
      setCurrentChapterIndex(nextIndex);
      saveAsyncStorage("currentChapterIndex", nextIndex);
      const ref = todayReading.references[nextIndex];
      const refPt = todayReading.referencesPt[nextIndex];
      const chapter = await fetchChapter(ref);
      setCurrentChapter(chapter);
      const notes = await loadNotes(chapter.reference);
      setNotes(notes);
      markChapterAsRead(refPt);
    }
  };

  const goToPreviousChapter = async () => {
    if (!todayReading) return;

    const prevIndex = currentChapterIndex - 1;
    if (prevIndex >= 0) {
      setCurrentChapterIndex(prevIndex);
      saveAsyncStorage("currentChapterIndex", prevIndex);
      const ref = todayReading.references[prevIndex];
      const chapter = await fetchChapter(ref);
      setCurrentChapter(chapter);
      const notes = await loadNotes(chapter.reference);
      setNotes(notes);

      // Opcional: se quiser desmarcar ao voltar
      setReadChapters((prev) => {
        const updated = prev.filter(
          (r) => r !== todayReading.referencesPt[currentChapterIndex]
        ); // retira o atual
        saveAsyncStorage("readChapters", updated);
        return updated;
      });
    }
  };

  const chapterId = currentChapter?.reference;

  const handleAddNote = async () => {
    if (!currentChapter || !newNote.trim()) return;
    const note = await addNote(chapterId, newNote);
    setNotes([...notes, note]);
    setIsAddingNote(false);
    setNewNote("");
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(chapterId, noteId);
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleEditNote = async () => {
    if (!editingNote) return;
    await updateNote(chapterId, editingNote.id, newNote);
    setEditingNote(null);
    setNewNote("");
    setIsAddingNote(false);
    setNotes(
      notes.map((n) =>
        n.id === editingNote.id ? { ...n, content: newNote } : n
      )
    );
  };

  if (loading || currentChapterIndex === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      ref={scrollRef}
      enableOnAndroid
      extraScrollHeight={100}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <View>
        <Appbar.Header style={{ backgroundColor: colors.cardBackground }}>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            color={colors.iconColor}
          />
          <Appbar.Content
            title="Leitura de Hoje"
            titleStyle={{ color: colors.textColor }}
          />
        </Appbar.Header>

        <ScrollView
          style={{ backgroundColor: colors.background }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.dayChallenge}>
                <Feather
                  name="calendar"
                  size={textSizes.sectionTitle}
                  color={colors.iconColor}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}>
                  Dia {todayReading.day} do Desafio
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.progressText}>
                  Progresso de hoje: {readChapters.length} de{" "}
                  {todayReading?.references.length ?? "?"} capítulos
                </Text>
                <ProgressBar
                  color={colors.buttonColor}
                  progress={
                    (readChapters.length || 0) /
                    (todayReading?.references.length || 1)
                  }
                  style={styles.progress}
                />

                <Text style={styles.chapterListTitle}>Capítulos de Hoje:</Text>
                {todayReading?.referencesPt.map((ref, index) => (
                  <View key={ref} style={styles.chapterItem}>
                    <View
                      style={[
                        styles.bullet,
                        {
                          backgroundColor: readChapters.includes(ref)
                            ? colors.buttonColor
                            : "#ccc",
                        },
                      ]}
                    />
                    <Text
                      style={{
                        color: colors.textColor,
                        textDecorationLine: readChapters.includes(ref)
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {ref}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    if (todayReading) {
                      await markDayAsCompleted(todayReading.day);
                      navigation.navigate("index");
                    }
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather
                      name="check-circle"
                      size={textSizes.iconSize}
                      color={colors.iconButton}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.buttonText}>Marque como Completo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "reading" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("reading")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "reading" && styles.activeTabText,
                  ]}
                >
                  Leitura
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "notes" && styles.activeTab]}
                onPress={() => setActiveTab("notes")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "notes" && styles.activeTabText,
                  ]}
                >
                  Anotações
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title of the chapter + button new note*/}
            {activeTab === "notes" && notes.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Feather
                    name="book-open"
                    size={textSizes.title}
                    color={colors.iconColor}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.title}>{chapterId}</Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setIsAddingNote(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Feather
                      name="plus"
                      size={textSizes.iconSize}
                      color={colors.iconButton}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.buttonText}>Nova</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Cards */}
            {activeTab === "reading" && (
              <View style={[styles.card, { marginBottom: 80 }]}>
                <View style={styles.cardHeader}>
                  {/* Botão para voltar capítulo */}
                  <TouchableOpacity onPress={goToPreviousChapter}>
                    <Feather
                      name="chevron-left"
                      size={textSizes.chapterNavArrow}
                      color={colors.iconColor}
                    />
                  </TouchableOpacity>

                  {/* Título centralizado */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Feather
                      name="book-open"
                      size={textSizes.title}
                      color={colors.iconColor}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.title}>{chapterId}</Text>
                  </View>

                  {/* Botão para avançar capítulo */}
                  <TouchableOpacity onPress={goToNextChapter}>
                    <Feather
                      name="chevron-right"
                      size={textSizes.chapterNavArrow}
                      color={colors.iconColor}
                    />
                  </TouchableOpacity>
                </View>

                {/* <View style={styles.cardContent}>
                    {currentChapter?.content.split("\n\n").map((p, idx) => (
                      <Text key={idx} style={styles.paragraph}>
                        {p}
                      </Text>
                    ))}
                  </View> */}
                <View style={styles.cardContent}>
                  {currentChapter?.verses.map((verse) => (
                    <Text key={verse.verse} style={styles.paragraph}>
                      <Text style={styles.verseNumber}>[{verse.verse}] </Text>
                      {verse.text.trim()}
                    </Text>
                  ))}
                </View>

                <View style={styles.cardHeader}>
                  {/* Botão para voltar capítulo */}

                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={goToPreviousChapter}
                  >
                    <Feather
                      name="chevron-left"
                      size={textSizes.chapterNavArrow}
                      color={colors.iconColor}
                    />
                    <Text style={styles.cardTitle}>Anterior</Text>
                  </TouchableOpacity>

                  {/* Botão para avançar capítulo */}

                  <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center" }}
                    onPress={goToNextChapter}
                  >
                    <Text style={styles.cardTitle}>Próximo</Text>

                    <Feather
                      name="chevron-right"
                      size={textSizes.chapterNavArrow}
                      color={colors.iconColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {activeTab === "notes" && (
              <>
                {isAddingNote || editingNote ? (
                  <View style={styles.card}>
                    <TextInput
                      ref={inputRef}
                      value={newNote}
                      onChangeText={setNewNote}
                      placeholder="Digite sua anotação..."
                      style={styles.input}
                      multiline
                      onFocus={() => {
                        // Scrolla automaticamente para mostrar o input quando ele ganhar foco
                        scrollRef.current?.scrollToFocusedInput(
                          inputRef.current
                        );
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 12,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setIsAddingNote(false);
                          setEditingNote(null); // cancela edição também
                          setNewNote("");
                        }}
                      >
                        <Text
                          style={[
                            styles.buttonText,
                            { color: colors.textColor },
                          ]}
                        >
                          Cancelar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.button}
                        onPress={editingNote ? handleEditNote : handleAddNote}
                      >
                        <Text style={styles.buttonText}>Salvar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    {/* Aqui mapeamos e exibimos as anotações */}
                    {notes.length > 0 && (
                      <View style={{ marginBottom: 100 }}>
                        {notes.map((note) => (
                          <View key={note.id} style={styles.noteItem}>
                            <Text style={styles.noteDate}>
                              {new Date(note.createdAt).toLocaleDateString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Text>
                            <Text style={styles.noteText}>{note.content}</Text>

                            <View style={styles.noteActions}>
                              <TouchableOpacity
                                onPress={() => handleDeleteNote(note.id)}
                              >
                                <Feather
                                  name="trash"
                                  size={18}
                                  color={colors.iconColor}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setEditingNote(note);
                                  setNewNote(note.content);
                                }}
                              >
                                <Feather
                                  name="edit"
                                  size={18}
                                  color={colors.iconColor}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Conteúdo padrão quando não há nota sendo criada */}
                    {notes.length === 0 && (
                      <View style={styles.card}>
                        <View style={styles.cardNotesContent}>
                          <Feather name="book-open" size={100} color="#ccc" />
                          <Text style={styles.infoLabel}>
                            Tome notas enquanto lê para registrar seus
                            pensamentos e percepções.
                          </Text>
                        </View>
                        <View style={styles.cardFooter}>
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => setIsAddingNote(true)}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Feather
                                name="plus"
                                size={textSizes.iconSize}
                                color={colors.iconButton}
                                style={{ marginRight: 8 }}
                              />
                              <Text style={styles.buttonText}>
                                Nova Anotação
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Feito com ♥️ por Gabriel Menezes
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
}

// API

const addNote = async (chapterId: string, content: string): Promise<Note> => {
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
};

const updateNote = async (
  chapterId: string,
  noteId: string,
  newContent: string
): Promise<Note | null> => {
  const key = chapterId.replace(/\s+/g, "");
  const stored = await AsyncStorage.getItem(key);
  const existingNotes: Note[] = stored ? JSON.parse(stored) : [];

  const updatedNotes = existingNotes.map((note) =>
    note.id === noteId ? { ...note, content: newContent } : note
  );

  await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));

  const updatedNote = updatedNotes.find((note) => note.id === noteId) || null;
  return updatedNote;
};

const loadNotes = async (chapterId: string): Promise<Note[]> => {
  const key = chapterId.replace(/\s+/g, "");
  const stored = await AsyncStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const deleteNote = async (chapterId: string, noteId: string): Promise<void> => {
  const key = chapterId.replace(/\s+/g, "");
  const stored = await AsyncStorage.getItem(key);
  const existingNotes: Note[] = stored ? JSON.parse(stored) : [];

  const updatedNotes = existingNotes.filter((note) => note.id !== noteId);

  await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));
};

async function markDayAsCompleted(day: number): Promise<void> {
  await updateReadingDayStatus("users-plan-2", day, true);
  await saveAsyncStorage("readChapters", []);
  await saveAsyncStorage("currentChapterIndex", 0);
  await saveAsyncStorage("confetti", true);
}

const saveAsyncStorage = async (key: string, content: any): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(content));
};

const loadAsyncStorage = async (key: string): Promise<any> => {
  const stored = await AsyncStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const createStyles = (colors: typeof lightTheme, textSizes: typeof medium) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.background,
    },
    paragraph: {
      marginBottom: 8,
      lineHeight: 20,
      color: colors.textColor,
      fontSize: textSizes.chapterText,
    },
    progress: {
      marginVertical: 16,
      backgroundColor: colors.dividerBackground,
    },
    completeButton: {
      marginVertical: 16,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    topSummaryCard: {
      margin: 12,
      paddingBottom: 12,
    },
    progressText: {
      marginBottom: 8,
      fontWeight: "500",
      color: colors.textColor,
    },
    chapterListTitle: {
      marginTop: 12,
      marginBottom: 6,
      fontWeight: "bold",
      color: colors.textColor,
    },
    chapterItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    bullet: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
      backgroundColor: colors.gray,
    },
    card: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      backgroundColor: colors.cardBackground,
    },
    dayChallenge: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      // paddingHorizontal: 16,
      // paddingVertical: 8,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: textSizes.subtitle,
      fontWeight: "bold",
      color: colors.textColor,
    },
    cardContent: {
      marginBottom: 12,
    },
    cardNotesContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    infoLabel: {
      fontSize: textSizes.paragraph,
      textAlign: "center",
      fontWeight: "bold",
      color: colors.subtitleText,
    },
    button: {
      backgroundColor: colors.buttonColor,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: textSizes.subtitle,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.dividerBackground,
      borderRadius: 8,
      marginBottom: 16,
      overflow: "hidden",
      borderColor: colors.dividerBackground,
      borderWidth: 1,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: colors.cardBackground,
    },
    tabText: {
      color: colors.gray,
      fontWeight: "500",
      fontSize: textSizes.subtitle,
    },
    activeTabText: {
      color: colors.textColor,
      fontWeight: "700",
      fontSize: textSizes.subtitle,
    },
    footer: {
      alignItems: "center",
      backgroundColor: colors.footerBackground,
    },
    footerText: {
      fontSize: textSizes.paragraph,
      marginVertical: 20,
      marginBottom: 100,
      color: colors.subtitleText,
    },
    input: {
      backgroundColor: colors.background,
      padding: 8,
      borderColor: colors.dropdownBorder,
      borderWidth: 1,
      borderRadius: 6,
      color: colors.textColor,
      marginBottom: 8,
      height: 150,
      textAlignVertical: "top",
    },
    noteItem: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.shadowColor,
      borderWidth: 1,
      borderColor: colors.borderColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    noteText: {
      fontSize: 16,
      color: colors.textColor,
      marginBottom: 8,
    },
    noteDate: {
      fontSize: 12,
      color: colors.date,
      marginBottom: 12,
    },
    noteActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      justifyContent: "flex-end",
    },
    title: {
      fontSize: textSizes.title,
      fontWeight: "bold",
      color: colors.textColor,
    },
    sectionTitle: {
      fontSize: textSizes.sectionTitle,
      fontWeight: "bold",
      color: colors.textColor,
    },
  });
