import CurrentChallengeCard from "@/components/CurrentChallengeCard";
import StartChallengeCard from "@/components/StartChallengeCard";
import { darkTheme, lightTheme } from "@/constants/Colors";
import { large, medium, small } from "@/constants/TextSizes";
import ThemeContext from "@/context/ThemeContext";
import {
  deleteReadingPlanFromStorage,
  editReadingPlan,
  generateReadingPlan,
  getTodayReading,
  loadAsyncStorage,
  loadReadingPlanFromStorage,
  ReadingDay,
  saveAsyncStorage,
} from "@/scripts/bible-api";
import { fetchChapter } from "@/scripts/bible-service";
import { BibleChapter } from "@/scripts/types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { Appbar, Paragraph, Title } from "react-native-paper";

export default function HomeScreen() {
  const [activePlan, setActivePlan] = useState(null);
  const [editingPlan, setEditPlan] = useState<Boolean>(false);
  const [todayReading, setTodayReading] = useState(null);
  const [currentChapter, setCurrentChapter] = useState<BibleChapter | null>(
    null
  );
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();
  const { theme, textSize } = useContext(ThemeContext);
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const textSizes =
    textSize === "small" ? small : textSize === "large" ? large : medium;
  const styles = createStyles(colors, textSizes);
  const [daysParam, setDaysParam] = useState("365");
  const [enableReminders, setEnableReminders] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCloseEditChallenge = async () => {
    setEditPlan(false);
  };

  const handleStartChallenge = async () => {
    await generateReadingPlan(Number(daysParam), "users-plan-2");
    navigation.navigate("today");
  };

  const handleEditChallenge = async () => {
    await editReadingPlan(activePlan, Number(daysParam), "users-plan-2");
    navigation.navigate("today");
  };

  const handleDeleteChallenge = async () => {
    Alert.alert(
      "Tem certeza?",
      "Você quer mesmo deletar este desafio? Essa ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: async () => {
            await deleteReadingPlanFromStorage("users-plan-2");
            setActivePlan(null);
            console.log(activePlan);
            setEditPlan(false);
            setTodayReading(null);
            setProgress(0);
            setCurrentChapter(null);
          },
          style: "destructive",
        },
      ]
    );
  };

  const loadAndSetReadingPlan = async (planName: string) => {
    const plan = await loadReadingPlanFromStorage(planName);
    if (plan) {
      setActivePlan(plan);
      setDaysParam(plan?.length.toString());
    }
    return plan;
  };

  const loadAndSetTodayReading = async () => {
    const today = await getTodayReading();
    setTodayReading(today);
    return today;
  };

  const calculateAndSetProgress = (plan: ReadingDay[]) => {
    const completed = plan.filter((day) => day.completed).length;
    const percentage = Math.round((completed / plan.length) * 100);
    setProgress(percentage);
  };

  const loadAndSetCurrentChapter = async (todayReading: ReadingDay) => {
    const loadedCurrentChapterIndex = await loadAsyncStorage(
      "currentChapterIndex"
    );

    const chapter = await fetchChapter(
      todayReading.references[loadedCurrentChapterIndex]
    );
    setCurrentChapter(chapter);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setEditPlan(false);
          const plan = await loadAndSetReadingPlan("users-plan-2");
          if (plan) {
            const today = await loadAndSetTodayReading();
            calculateAndSetProgress(plan);
            await loadAndSetCurrentChapter(today);

            setShowConfetti(await loadAsyncStorage("confetti"));
            setTimeout(async () => {
              setShowConfetti(false);
              await saveAsyncStorage("confetti", false);
            }, 4000);
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      };

      fetchData();
    }, [])
  );

  if (!!currentChapter || !activePlan) {
    return (
      <View style={StyleSheet.absoluteFill}>
        <Appbar.Header
          style={{
            backgroundColor: colors.background,
            justifyContent: "center",
          }}
        >
          <View style={styles.headerRow}>
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={24}
              color={colors.iconColor}
            />
            <Text style={styles.headerTitle}>BibleChallenge</Text>
          </View>
        </Appbar.Header>

        <ScrollView style={{ backgroundColor: colors.background }}>
          <View style={styles.container}>
            <View style={styles.centered}>
              <Title style={styles.title}>Leia a Bíblia no Seu Tempo</Title>
              <Paragraph style={styles.subtitle}>
                Escolha seu desafio, defina seu ritmo e cresça na fé
                diariamente.
              </Paragraph>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.cardHeader}>
              <Feather
                name="award"
                size={textSizes.title}
                color={colors.iconColor}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardTitle}>
                {activePlan ? "Continue seu Desafio!" : "Escolha um Desafio!"}
              </Text>
            </View>

            {activePlan && !editingPlan ? (
              <CurrentChallengeCard
                setEditPlan={setEditPlan}
                navigation={navigation}
                todayReading={todayReading}
                activePlan={activePlan}
                currentChapter={currentChapter}
              />
            ) : (
              <>
                {editingPlan ? (
                  <StartChallengeCard
                    editingPlan={true}
                    days={daysParam}
                    setDays={setDaysParam}
                    onEdit={handleEditChallenge}
                    enableReminders={enableReminders}
                    setEnableReminders={setEnableReminders}
                    onDelete={handleDeleteChallenge}
                    setCloseEdit={handleCloseEditChallenge}
                  />
                ) : (
                  <StartChallengeCard
                    editingPlan={false}
                    days={daysParam}
                    setDays={setDaysParam}
                    onStart={handleStartChallenge}
                    enableReminders={enableReminders}
                    setEnableReminders={setEnableReminders}
                    setCloseEdit={handleCloseEditChallenge}
                  />
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
        {showConfetti === true && (
          <ConfettiCannon
            count={200}
            origin={{ x: 200, y: 0 }} // você pode ajustar o `x` para centralizar mais, se quiser
            fadeOut
            explosionSpeed={800}
            fallSpeed={3000}
          />
        )}
      </View>
    );
  }
}

const createStyles = (colors: typeof lightTheme, textSizes: typeof medium) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.cardBackground,
    },
    divider: {
      height: 1,
      backgroundColor: colors.dividerBackground,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: 16,
      padding: 0,
    },
    headerContainer: {
      flex: 1,
      backgroundColor: colors.cardBackground,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: textSizes.logo,
      fontWeight: "bold",
      marginLeft: 8,
      fontFamily: "GeistSans",
      color: colors.textColor,
    },
    centered: {
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: textSizes.title,
      textAlign: "center",
      fontWeight: "bold",
      color: colors.textColor,
    },
    subtitle: {
      textAlign: "center",
      color: colors.subtitleText,
      marginVertical: 8,
      fontWeight: "bold",
      fontSize: textSizes.paragraph,
    },
    buttonRow: {
      flexDirection: "row",
      marginTop: 12,
      gap: 8,
    },
    section: {
      flex: 1,
      padding: 16,
    },
    progress: {
      marginVertical: 16,
      backgroundColor: colors.dividerBackground,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
    },
    icon: {
      marginRight: 6,
      color: colors.iconColor,
    },
    smallText: {
      fontSize: textSizes.paragraph,
      color: colors.gray,
    },
    footer: {
      alignItems: "center",
      backgroundColor: colors.footerBackground,
    },
    footerText: {
      fontSize: textSizes.paragraph,
      marginVertical: 20,
      marginBottom: 100,
      color: colors.textColor,
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 24, // ajusta a largura com base no texto
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center", // opcional, centraliza se o container permitir
    },
    buttonText: {
      color: "#fff",
      fontSize: textSizes.subtitle,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    buttonInverse: {
      backgroundColor: colors.buttonInverseBackground,
      borderWidth: 1.5,
      borderColor: colors.buttonInverseBorder,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    buttonTextInverse: {
      color: colors.buttonInverseText,
      fontSize: textSizes.paragraph,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    progressText: {
      marginBottom: 8,
      fontWeight: "500",
      color: colors.textColor,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: textSizes.sectionTitle,
      fontWeight: "bold",
      color: colors.textColor,
    },
    sectionTitle: {
      textAlign: "center",
      marginBottom: 16,
      fontSize: textSizes.sectionTitle,
      fontWeight: "bold",
      color: colors.textColor,
    },
  });
