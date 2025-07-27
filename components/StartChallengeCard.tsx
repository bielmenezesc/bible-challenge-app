import { darkTheme, lightTheme } from "@/constants/Colors";
import { large, medium, small } from "@/constants/TextSizes";
import ThemeContext from "@/context/ThemeContext";
import React, { useContext, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import DailyReminder from "./DailyReminder";

const totalChapters = 1189;
const screenWidth = Dimensions.get("window").width;
const ITEM_WIDTH = screenWidth / 5.11;

export default function StartChallengeCard({
  editingPlan,
  days,
  setDays,
  onStart,
  onEdit,
  onDelete,
  enableReminders,
  setEnableReminders,
  setCloseEdit,
}: {
  editingPlan: boolean;
  days: string;
  setDays: (val: string) => void;
  onStart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  enableReminders: boolean;
  setEnableReminders: (val: boolean) => void;
  setCloseEdit: (val: boolean) => void;
}) {
  const listRef = useRef<FlatList>(null);
  const chaptersPerDay = Math.ceil(totalChapters / parseInt(days, 10));
  console.log(days);

  const { theme, textSize } = useContext(ThemeContext);
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const textSizes =
    textSize === "small" ? small : textSize === "large" ? large : medium;
  const styles = createStyles(colors, textSizes);

  useEffect(() => {
    const index = parseInt(days, 10) - 30;
    if (listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index,
          animated: false,
          viewPosition: 0.5,
        });
      }, 0);
    }
  }, []);

  return (
    <View style={styles.card}>
      {/* Botão de sair no canto superior direito */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
        }}
        onPress={() => {
          setCloseEdit(true);
        }}
      >
        <View
          style={{
            backgroundColor: "#f2f2f2", // cinza claro
            borderRadius: 20,
            padding: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="x" size={textSizes.title} color={colors.iconColor} />
        </View>
      </TouchableOpacity>

      <View style={styles.cardHeader}>
        <Feather
          name="book-open"
          size={textSizes.sectionTitle}
          color={colors.iconColor}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.cardTitle}>{`Desafio de ${days} Dias`}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duração do desafio:</Text>
          <Text style={styles.infoValue}>{days} dias</Text>
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
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            getItemLayout={(data, index) => ({
              length: ITEM_WIDTH,
              offset: ITEM_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setDays(item)}
                style={{
                  width: 60,
                  height: 60,
                  marginHorizontal: 8,
                  borderRadius: 30,
                  backgroundColor:
                    days === item ? colors.buttonColor : colors.cardBackground,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor:
                    days === item ? colors.buttonColor : colors.borderColor,
                }}
              >
                <Text
                  style={{
                    color: days === item ? "#fff" : colors.textColor,
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
      </View>

      <View style={styles.cardFooter}>
        {/* Notifications */}
        <DailyReminder />
        {editingPlan ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onDelete} style={styles.buttonInverse}>
              <Text style={styles.buttonTextInverse}>Deletar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onEdit} style={styles.button}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={onStart}>
            <Text style={styles.buttonText}>Iniciar Desafio</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: typeof lightTheme, textSizes: typeof medium) =>
  StyleSheet.create({
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
      fontSize: textSizes.sectionTitle,
      fontWeight: "bold",
      color: colors.textColor,
    },
    cardContent: {
      marginBottom: 12,
      marginTop: 16,
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
      color: colors.buttonText,
      fontSize: textSizes.subtitle,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    buttonInverse: {
      backgroundColor: colors.buttonInverseBackground,
      borderWidth: 1.5,
      borderColor: colors.red,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    buttonTextInverse: {
      color: colors.red,
      fontSize: textSizes.paragraph,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    buttonRow: {
      flexDirection: "row",
      marginTop: 12,
      gap: 8,
    },
  });
