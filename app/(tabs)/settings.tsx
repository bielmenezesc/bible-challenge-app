import { darkTheme, lightTheme } from "@/constants/Colors";
import { large, medium, small } from "@/constants/TextSizes";
import ThemeContext from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Appbar, Divider, Switch, Text } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";

export default function SettingsScreen() {
  const [enableNotifications, setEnableNotifications] = useState(false);
  const { theme, toggleTheme, textSize, toggleTextSize } =
    useContext(ThemeContext);
  const [themeColor, setThemeColor] = useState(theme);
  const [fontSize, setFontSize] = useState(textSize);
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [openFontSize, setOpenFontSize] = useState(false);
  const getThemeItems = () => [
    {
      label: "Claro",
      value: "light",
      icon: () => <Feather name="sun" color={colors.iconColor} size={18} />,
    },
    {
      label: "Escuro",
      value: "dark",
      icon: () => <Feather name="moon" color={colors.iconColor} size={18} />,
    },
    {
      label: "Padrão do Sistema",
      value: "system",
      icon: () => (
        <Feather name="smartphone" color={colors.iconColor} size={18} />
      ),
    },
  ];
  const getFontSizeItems = () => [
    {
      label: "Pequeno",
      value: "small",
      icon: () => <Feather name="minus" color={colors.iconColor} size={18} />,
    },
    {
      label: "Médio",
      value: "medium",
      icon: () => <Feather name="type" color={colors.iconColor} size={18} />,
    },
    {
      label: "Grande",
      value: "large",
      icon: () => <Feather name="plus" color={colors.iconColor} size={18} />,
    },
  ];

  const colors = theme === "dark" ? darkTheme : lightTheme;
  const textSizes =
    textSize === "small" ? small : textSize === "large" ? large : medium;

  const styles = createStyles(colors, textSizes);

  // useEffect(() => {
  //   const loadSettings = async () => {
  //     const notif = await AsyncStorage.getItem("enableReminders");
  //     const savedTheme = await AsyncStorage.getItem("theme");
  //     const savedFontSize = await AsyncStorage.getItem("fontSize");

  //     setEnableNotifications(notif === "true");
  //     if (savedTheme) setThemeColor(savedTheme);
  //     if (savedFontSize) setFontSize(savedFontSize);
  //   };

  //   loadSettings();
  // }, []);

  const handleToggleTheme = async (value: string) => {
    await toggleTheme(value);
  };

  const handleToggleTextSize = async (value: string) => {
    await toggleTextSize(value);
  };

  const handleNotificationToggle = async () => {
    const newValue = !enableNotifications;
    setEnableNotifications(newValue);
    await AsyncStorage.setItem("enableReminders", newValue.toString());

    if (newValue) {
      // Request permission if needed (if using expo-notifications or similar)
      // You can hook into Notifications.requestPermissionsAsync()
    }
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: colors.cardBackground }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.iconColor}
        />
        <Appbar.Content
          title="Configurações"
          titleStyle={{ color: colors.textColor }}
        />
      </Appbar.Header>

      <ScrollView
        nestedScrollEnabled={true}
        style={{ backgroundColor: colors.background }}
      >
        {/* Appearance */}
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Aparência</Text>
            <Text style={styles.infoLabel}>
              Customize como a aparência do seu app
            </Text>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Feather
                  name="tool"
                  color={colors.iconColor}
                  size={20}
                  marginRight={8}
                />
                <Text style={styles.cardTitle}>Tema</Text>
              </View>
              <DropDownPicker
                listMode="SCROLLVIEW"
                open={open}
                value={themeColor}
                items={getThemeItems()}
                setOpen={setOpen}
                setValue={setThemeColor}
                onChangeValue={handleToggleTheme}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContent}
                placeholder="Select theme"
                textStyle={{ color: colors.textColor }}
                TickIconComponent={() => (
                  <Feather name="check" size={20} color={colors.iconColor} />
                )}
              />

              <Divider style={styles.divider} />

              <View style={styles.cardHeader}>
                <Feather
                  name="type"
                  color={colors.iconColor}
                  size={20}
                  marginRight={8}
                />
                <Text style={styles.cardTitle}>Tamanho da Fonte</Text>
              </View>
              <DropDownPicker
                listMode="SCROLLVIEW"
                zIndex={3000}
                zIndexInverse={1000}
                open={openFontSize}
                value={fontSize}
                items={getFontSizeItems()}
                setOpen={setOpenFontSize}
                setValue={setFontSize}
                onChangeValue={handleToggleTextSize}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContent}
                placeholder="Select font size"
                textStyle={{ color: colors.textColor }}
                TickIconComponent={() => (
                  <Feather name="check" size={20} color={colors.iconColor} />
                )}
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.card}>
            <Text style={styles.title}>Notificações</Text>
            <Text style={styles.infoLabel}>
              Gerencie suas perferências de notificações
            </Text>

            <View style={styles.cardContent}>
              <View style={styles.notificationRow}>
                <View style={styles.notificationHeader}>
                  <Feather
                    name="bell"
                    color={colors.iconColor}
                    size={20}
                    marginRight={8}
                  />
                  <Text style={styles.cardTitle}>Ativar Notificações</Text>
                </View>

                <Switch
                  value={enableNotifications}
                  onValueChange={handleNotificationToggle}
                  trackColor={{ false: "#ccc", true: "lightGreen" }}
                />
              </View>

              <Text style={styles.infoLabel}>
                Receba diariamente uma notificação para lembrar-lo de continuar
                sua leitura
              </Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.card}>
            <Text style={styles.title}>Sobre</Text>
            <Text style={styles.infoLabel}>BibleChallenge App</Text>

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Feather
                  name="terminal"
                  color={colors.iconColor}
                  size={20}
                  marginRight={8}
                />
                <Text style={styles.cardTitle}>Versão 1.0.0</Text>
              </View>
              <Text style={styles.infoLabel}>
                Este aplicativo ajuda você a ler a Bíblia no seu ritmo, com
                planos de leitura personalizáveis.
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
    </>
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
      marginBottom: 16,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    divider: {
      marginVertical: 10,
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
    title: {
      fontSize: textSizes.title,
      fontWeight: "bold",
      color: colors.textColor,
    },
    cardContent: {
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: textSizes.paragraph,
      fontWeight: "bold",
      color: colors.gray,
      marginBottom: 16,
    },
    dropdown: {
      borderColor: colors.dropdownBorder,
      backgroundColor: colors.dropdownBackground,
    },
    dropdownContent: {
      borderColor: colors.dropdownBorder,
      backgroundColor: colors.dropdownBackground,
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
    notificationRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    notificationHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      color: colors.iconColor,
      marginRight: 8,
      size: 20,
    },
  });
