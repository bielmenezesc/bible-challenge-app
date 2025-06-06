import StartChallengeCard from "@/components/StartChallengeCard";
import { darkTheme, lightTheme } from "@/constants/Colors";
import { large, medium, small } from "@/constants/TextSizes";
import ThemeContext from "@/context/ThemeContext";
import {
  generateReadingPlan,
  getTodayReading,
  loadAsyncStorage,
  loadReadingPlanFromStorage,
  saveAsyncStorage,
} from "@/scripts/bible-api";
import { fetchChapter } from "@/scripts/bible-service";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import ConfettiCannon from "react-native-confetti-cannon";
import { Appbar, Paragraph, Title } from "react-native-paper";

type BibleChapter = {
  reference: string;
  content: string;
  verses: [];
};

export default function HomeScreen() {
  const [activePlan, setActivePlan] = useState(null);
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

  const handleStartChallenge = async () => {
    await generateReadingPlan(Number(daysParam), "users-plan-2");
    navigation.navigate("today");
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const plan = await loadReadingPlanFromStorage("users-plan-2");
          setActivePlan(plan);
          if (plan) {
            const today = await getTodayReading();
            setTodayReading(today);
            const completed = plan.filter((day) => day.completed).length;
            const percentage = Math.round((completed / plan.length) * 100);
            setProgress(percentage);

            const loadedCurrentChapterIndex = await loadAsyncStorage(
              "currentChapterIndex"
            );

            const chapter = await fetchChapter(
              today.references[loadedCurrentChapterIndex]
            );
            setCurrentChapter(chapter);

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

  if (currentChapter) {
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
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("startChallenge")}
                >
                  <Text style={styles.buttonText}>Começar Desafio</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonInverse}
                  onPress={() => navigation.navigate("today")}
                >
                  <Text style={styles.buttonTextInverse}>Leitura de Hoje</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Title style={styles.sectionTitle}>
              {activePlan ? "Seu Desafio Ativo" : "Escolha um Desafio!"}
            </Title>

            {activePlan ? (
              <View style={styles.card}>
                <View style={{ alignItems: "center" }}>
                  <View style={styles.cardHeader}>
                    <Feather
                      name="award"
                      size={textSizes.sectionTitle}
                      color={colors.iconColor}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={
                        (styles.cardTitle,
                        [
                          {
                            fontSize: textSizes.sectionTitle,
                            fontWeight: "bold",
                          },
                        ])
                      }
                    >
                      Continue sua Jornada!
                    </Text>
                  </View>
                  <View style={{ marginTop: 24 }}>
                    <AnimatedCircularProgress
                      size={180}
                      width={12}
                      fill={(todayReading?.day / activePlan.length) * 100}
                      tintColor="#4CAF50"
                      backgroundColor="#E0E0E0"
                      lineCap="round"
                    >
                      {() => (
                        <>
                          <Text
                            style={{
                              fontSize: textSizes.dayCircularProgress,
                              marginBottom: -15,
                            }}
                          >
                            {todayReading?.day}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: textSizes.subtitle,
                            }}
                          >
                            {activePlan.length} dias
                          </Text>
                        </>
                      )}
                    </AnimatedCircularProgress>
                  </View>
                </View>
                <View style={(styles.cardFooter, [{ marginTop: 25 }])}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("today")}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>
                      {todayReading?.completed
                        ? "Ver Leitura Completada"
                        : `Continuar em ${currentChapter?.reference}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <StartChallengeCard
                  days={daysParam}
                  setDays={setDaysParam}
                  onStart={handleStartChallenge}
                  enableReminders={enableReminders}
                  setEnableReminders={setEnableReminders}
                />
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
      marginBottom: 24,
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
      backgroundColor: colors.background,
    },
    sectionTitle: {
      textAlign: "center",
      marginBottom: 16,
      fontSize: textSizes.sectionTitle,
      fontWeight: "bold",
      color: colors.textColor,
    },
    card: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      backgroundColor: colors.cardBackground,
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
      backgroundColor: colors.buttonColor,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    buttonText: {
      color: "#fff",
      fontSize: textSizes.paragraph,
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
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    cardTitle: {
      fontSize: textSizes.subtitle,
      fontWeight: "bold",
      color: colors.textColor,
    },
    cardFooter: {
      marginTop: 12,
    },
    progressText: {
      marginBottom: 8,
      fontWeight: "500",
      color: colors.textColor,
    },
  });
