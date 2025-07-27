import { darkTheme, lightTheme } from "@/constants/Colors";
import { large, medium, small } from "@/constants/TextSizes";
import ThemeContext from "@/context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

export default function CurrentChallengeCard({
  setEditPlan,
  navigation,
  todayReading,
  activePlan,
  currentChapter,
}) {
  const { theme, textSize } = useContext(ThemeContext);
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const textSizes =
    textSize === "small" ? small : textSize === "large" ? large : medium;
  const styles = createStyles(colors, textSizes);

  return (
    <View style={styles.card}>
      {/* Botão de editar no canto superior direito */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
        }}
        onPress={() => {
          setEditPlan(true);
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
          <Feather name="edit-2" size={textSizes.title} color={"#EC9C28"} />
        </View>
      </TouchableOpacity>

      <View style={{ alignItems: "center" }}>
        <View>
          <AnimatedCircularProgress
            size={180}
            width={12}
            fill={(todayReading?.day / activePlan?.length) * 100}
            tintColor="#f6d365"
            backgroundColor="#E0E0E0"
            lineCap="round"
          >
            {() => (
              <>
                <Text
                  style={{
                    fontSize: textSizes.dayCircularProgress,
                    marginBottom: -15,
                    color: colors.textColor,
                  }}
                >
                  {todayReading?.day}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: textSizes.subtitle,
                    color: colors.textColor,
                  }}
                >
                  {activePlan?.length} dias
                </Text>
              </>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
      <View style={(styles.cardFooter, [{ marginTop: 25 }])}>
        <TouchableOpacity onPress={() => navigation.navigate("today")}>
          <LinearGradient
            colors={["#f6d365", "#fda085"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {todayReading?.completed
                ? "Ver Leitura Completada"
                : `Continuar em ${currentChapter?.reference}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: typeof lightTheme, textSizes: typeof medium) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 24,
      padding: 16,
      marginBottom: 24,
      backgroundColor: colors.cardBackground,
    },
    cardFooter: {
      marginTop: 12,
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
  });
