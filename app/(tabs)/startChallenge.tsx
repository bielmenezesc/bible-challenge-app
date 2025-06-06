import { darkTheme, lightTheme } from "@/constants/Colors";
import { large, medium, small } from "@/constants/TextSizes";
import ThemeContext from "@/context/ThemeContext";
import { generateReadingPlan } from "@/scripts/bible-api";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Appbar } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";

const totalChapters = 1189; // Total de capítulos da Bíblia

export default function StartChallengeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // const daysParam = route.params?.days || "364";

  const [enableReminders, setEnableReminders] = useState(true);
  const [date, setDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const { theme, textSize } = useContext(ThemeContext);
  const [daysParam, setDaysParam] = useState("364");
  const listRef = useRef<FlatList>(null);

  const chaptersPerDay = Math.ceil(totalChapters / parseInt(daysParam, 10));
  const expectedEndDate = new Date(
    new Date().getTime() + parseInt(daysParam, 10) * 24 * 60 * 60 * 1000
  );

  const colors = theme === "dark" ? darkTheme : lightTheme;
  const textSizes =
    textSize === "small" ? small : textSize === "large" ? large : medium;

  const styles = createStyles(colors, textSizes);

  const screenWidth = Dimensions.get("window").width;
  const ITEM_WIDTH = screenWidth / 5.11; // largura + margem horizontal

  useEffect(() => {
    const index = parseInt(daysParam, 10) - 30;
    if (listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index,
          animated: false,
          viewPosition: 0.5, // centraliza
        });
      }, 0); // garante que espere a montagem
    }
  }, []);

  const handleStartChallenge = async () => {
    try {
      await generateReadingPlan(Number(daysParam), "users-plan-2");

      // Armazenar preferência de lembretes
      // AsyncStorage pode ser usado para armazenamento persistente
      // await AsyncStorage.setItem('enableReminders', enableReminders.toString());

      // Navegar para a leitura de hoje
      navigation.navigate("today");
    } catch (error) {
      console.error("Falha ao iniciar o desafio:", error);
      Alert.alert(
        "Erro",
        "Falha ao iniciar o desafio. Por favor, tente novamente."
      );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: colors.cardBackground }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.iconColor}
        />
        <Appbar.Content
          title="Iniciar Desafio"
          titleStyle={{ color: colors.textColor }}
        />
      </Appbar.Header>

      <ScrollView style={{ backgroundColor: colors.background }}>
        {/* Cabeçalho */}
        <View style={styles.container}>
          {/* Cartão de Desafio */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather
                name="book-open"
                size={20}
                color={colors.iconColor}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cardTitle}>
                {daysParam === "364"
                  ? "Desafio de 364 Dias"
                  : daysParam === "90"
                  ? "Desafio de 90 Dias"
                  : `Desafio de ${daysParam} Dias`}
              </Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duração do desafio:</Text>
                <Text style={styles.infoValue}>{daysParam} dias</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Leitura diária:</Text>
                <Text style={styles.infoValue}>
                  ~{chaptersPerDay} capítulos por dia
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tempo estimado:</Text>
                <Text style={styles.infoValue}>
                  ~{chaptersPerDay * 5}-{chaptersPerDay * 7} minutos por dia
                </Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: textSizes.subtitle,
                    fontWeight: "bold",
                    color: colors.textColor,
                    marginBottom: 20,
                  }}
                >
                  Duração do desafio em Dias:
                </Text>
                <FlatList
                  ref={listRef}
                  data={[...Array(1160).keys()].map((i) => (i + 30).toString())}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  snapToAlignment="center"
                  snapToInterval={ITEM_WIDTH} // Largura de cada item
                  decelerationRate="fast"
                  getItemLayout={(data, index) => ({
                    length: ITEM_WIDTH,
                    offset: ITEM_WIDTH * index,
                    index,
                  })}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setDaysParam(item)}
                      style={{
                        width: 60,
                        height: 60,
                        marginHorizontal: 8,
                        borderRadius: 30,
                        backgroundColor:
                          daysParam === item
                            ? colors.buttonColor
                            : colors.cardBackground,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor:
                          daysParam === item
                            ? colors.buttonColor
                            : colors.borderColor,
                      }}
                    >
                      <Text
                        style={{
                          color: daysParam === item ? "#fff" : colors.textColor,
                          fontWeight: "bold",
                          fontSize: textSizes.subtitle,
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Alternância de Lembretes */}
              <View style={styles.switchContainer}>
                <Switch
                  value={enableReminders}
                  onValueChange={setEnableReminders}
                />
                <Text style={styles.switchLabel}>Ativar lembretes diários</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleStartChallenge}
              >
                <Text style={styles.buttonText}>Iniciar Desafio</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* O que esperar */}
          <View style={styles.expectations}>
            <Text style={styles.expectationsTitle}>O que esperar:</Text>
            <View style={styles.expectationItem}>
              <Feather
                name="check-circle"
                size={16}
                color="green"
                style={styles.expectationIcon}
              />
              <Text style={styles.expectationText}>
                Leituras diárias da Bíblia divididas em seções gerenciáveis
              </Text>
            </View>
            <View style={styles.expectationItem}>
              <Feather
                name="check-circle"
                size={16}
                color="green"
                style={styles.expectationIcon}
              />
              <Text style={styles.expectationText}>
                Rastreamento de progresso para mantê-lo motivado
              </Text>
            </View>
            <View style={styles.expectationItem}>
              <Feather
                name="check-circle"
                size={16}
                color="green"
                style={styles.expectationIcon}
              />
              <Text style={styles.expectationText}>
                Lembretes diários opcionais para ajudá-lo a manter a
                consistência
              </Text>
            </View>
            <View style={styles.expectationItem}>
              <Feather
                name="check-circle"
                size={16}
                color="green"
                style={styles.expectationIcon}
              />
              <Text style={styles.expectationText}>
                Recursos de anotação para registrar seus insights
              </Text>
            </View>
            <View style={styles.expectationItem}>
              <Feather
                name="calendar"
                size={16}
                color="green"
                style={styles.expectationIcon}
              />
              <Text style={styles.expectationText}>
                Conclua toda a Bíblia até{" "}
                {expectedEndDate.toLocaleDateString("pt-BR")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Feito com ♥️ por Gabriel Menezes
          </Text>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const createStyles = (colors: typeof lightTheme, textSizes: typeof medium) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      marginTop: 50,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    backText: {
      marginLeft: 4,
      fontSize: textSizes.subtitle,
      color: colors.backText,
    },
    card: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      backgroundColor: colors.cardBackground,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
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
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: textSizes.paragraph,
      color: colors.subtitleText,
    },
    infoValue: {
      fontSize: textSizes.paragraph,
      fontWeight: "bold",
      color: colors.textColor,
    },
    datePickerContainer: {
      marginTop: 12,
    },
    label: {
      fontSize: textSizes.paragraph,
      marginBottom: 4,
      color: colors.labelText,
    },
    dateButton: {
      padding: 12,
      borderWidth: 1,
      borderColor: colors.dateButtonBorder,
      borderRadius: 4,
    },
    dateButtonText: {
      fontSize: textSizes.paragraph,
      color: colors.textColor,
    },
    switchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    switchLabel: {
      marginLeft: 8,
      fontSize: textSizes.paragraph,
      color: colors.textColor,
    },
    cardFooter: {
      marginTop: 12,
    },
    expectations: {
      marginTop: 24,
    },
    expectationsTitle: {
      fontSize: textSizes.subtitle,
      fontWeight: "bold",
      marginBottom: 12,
      color: colors.textColor,
    },
    expectationItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    expectationIcon: {
      marginRight: 8,
      marginTop: 2,
    },
    expectationText: {
      flex: 1,
      fontSize: textSizes.paragraph,
      color: colors.expectationText,
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
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: textSizes.subtitle,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
  });
