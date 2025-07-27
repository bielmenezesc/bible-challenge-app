// Tem que lembrar que só é possível testar se a notificação diária funciona com um app compilado deployado no
// seu celular, porque o expo-notifications não funciona no app da Expo Go,
// e para ter um app build deployment no seu celular de um jeito ou de outro você precisa de uma conta
// na Apple Developer, q custa $99, então tem que esperar pra poder testar

import { darkTheme, lightTheme } from "@/constants/Colors";
import { large, medium, small } from "@/constants/TextSizes";
import ThemeContext from "@/context/ThemeContext";
import { loadAsyncStorage, saveAsyncStorage } from "@/scripts/bible-api";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useCallback, useContext, useState } from "react";
import {
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const DailyReminder = () => {
  const { theme, textSize } = useContext(ThemeContext);
  const colors = theme === "dark" ? darkTheme : lightTheme;
  const textSizes =
    textSize === "small" ? small : textSize === "large" ? large : medium;
  const styles = createStyles(colors, textSizes);

  // State for whether the reminder is enabled
  const [enabled, setEnabled] = useState(false);
  // State to control the visibility of the DateTimePicker modal
  const [showPicker, setShowPicker] = useState(false);
  // The actual time set for the reminder
  const [time, setTime] = useState(new Date());
  // Temporary time used in the picker before confirmation
  const [tempTime, setTempTime] = useState(new Date());

  // Formatted time string for display
  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  // useFocusEffect to load settings when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // Load the reminder settings object from AsyncStorage
          const savedSettings = await loadAsyncStorage("dailyReminderSettings");
          // IMPORTANT: Check if savedSettings is not null/undefined before parsing
          if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            // Create a new Date object using the loaded hour and minute
            const loadedTime = new Date();
            loadedTime.setHours(parsedSettings.hour);
            loadedTime.setMinutes(parsedSettings.minute);
            loadedTime.setSeconds(0);
            loadedTime.setMilliseconds(0);

            // Set the time and enabled states from loaded data
            setTime(loadedTime);
            setTempTime(loadedTime); // Also update tempTime for initial picker value
            setEnabled(parsedSettings.enabled);
          } else {
            // If no settings found (first time opening app), initialize with current time and disabled
            const now = new Date();
            setTime(now);
            setTempTime(now);
            setEnabled(false);
          }
        } catch (error) {
          // Log the parsing error and fall back to default values
          console.error(
            "Failed to load or parse daily reminder settings:",
            error
          );
          const now = new Date();
          setTime(now);
          setTempTime(now);
          setEnabled(false);
        }
      };

      fetchData();
    }, [])
  );

  /**
   * Schedules a daily notification at the specified time.
   * @param {Date} notificationTime - The time to schedule the notification.
   */
  async function scheduleDailyNotification(notificationTime) {
    // Cancel all existing notifications to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete Diário",
        body: "Hora de fazer sua leitura da Bíblia! 🙏",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: notificationTime.getHours(),
        minute: notificationTime.getMinutes(),
        repeats: true,
      },
    });
  }

  /**
   * Cancels all scheduled notifications.
   */
  async function cancelNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Handles the confirmation of the time selection.
   * Saves the chosen time and enabled state to AsyncStorage and schedules/cancels notifications.
   */
  const handleConfirm = async () => {
    // Update the main time state with the temporary time
    setTime(tempTime);
    // Save the updated settings (hour, minute, enabled) to AsyncStorage
    await saveAsyncStorage(
      "dailyReminderSettings",
      JSON.stringify({
        hour: tempTime.getHours(),
        minute: tempTime.getMinutes(),
        enabled: enabled,
      })
    );
    // Close the picker modal
    setShowPicker(false);
    // If enabled, schedule the notification with the new time
    if (enabled) {
      await scheduleDailyNotification(tempTime);
    }
  };

  /**
   * Toggles the enabled state of the daily reminder.
   * Handles permission requests and schedules/cancels notifications accordingly.
   */
  const toggleSwitch = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled); // Optimistically update state

    // Save the new enabled state along with the current time (hour and minute)
    await saveAsyncStorage(
      "dailyReminderSettings",
      JSON.stringify({
        hour: time.getHours(),
        minute: time.getMinutes(),
        enabled: newEnabled,
      })
    );

    if (newEnabled) {
      // Request notification permissions if not granted
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          // Use a custom modal or message box instead of alert()
          // For now, logging to console as alert() is disallowed in Canvas
          console.warn(
            "Você precisa permitir notificações para ativar o lembrete."
          );
          setEnabled(false); // Revert toggle if permission not granted
          return;
        }
      }
      // Schedule notification if enabled and permissions are granted
      await scheduleDailyNotification(time);
    } else {
      // Cancel notifications if disabled
      await cancelNotifications();
    }
  };

  return (
    <>
      {/* TouchableOpacity to open the time picker */}
      <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.8}>
        <View style={styles.card}>
          <View style={styles.textContainer}>
            <Feather name="bell" size={24} style={styles.icon} />
            <View>
              <Text style={styles.title}>Lembrete Diário</Text>
              {/* Display the formatted time */}
              <Text style={styles.subtitle}>Agendado para {formattedTime}</Text>
            </View>
          </View>

          {/* Switch to enable/disable the reminder */}
          <Switch
            value={enabled}
            onValueChange={toggleSwitch}
            trackColor={{ false: "#ccc", true: "lightGreen" }}
            style={styles.switch}
          />
        </View>
      </TouchableOpacity>

      {/* Modal for the DateTimePicker */}
      {showPicker && (
        <Modal transparent animationType="fade">
          {/* Add onPress to modalOverlay to close the modal when clicked outside */}
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1} // Keep opacity at 1 to ensure touch is captured
            onPress={() => setShowPicker(false)}
          >
            <View
              style={styles.modalContainer}
              onStartShouldSetResponder={() => true}
            >
              <DateTimePicker
                value={tempTime} // Use tempTime for the picker's value
                mode="time"
                display="spinner"
                is24Hour={true}
                onChange={(e, selected) => selected && setTempTime(selected)}
              />
              {/* Buttons for Cancel and OK */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => setShowPicker(false)}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm} style={styles.button}>
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

// Stylesheet creation function
const createStyles = (colors, textSizes) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      backgroundColor: colors.cardBackground,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    icon: {
      color: colors.iconColor,
    },
    title: {
      color: colors.textColor,
      fontSize: 16,
      fontWeight: "600",
    },
    subtitle: {
      color: colors.gray,
      fontSize: 14,
      marginTop: 2,
    },
    switch: {
      transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: colors.buttonColor,
      borderRadius: 12,
      padding: 24,
      width: "80%",
      alignItems: "center",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      width: "100%",
    },
    button: {
      flex: 1,
      marginHorizontal: 8,
      paddingVertical: 10,
      backgroundColor: colors.lightGray,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: colors.textColor,
      fontWeight: "600",
    },
  });

export default DailyReminder;
