// this was an attempt to make a component where
// the user can on/off notifications and choose the time
// of the notification
// this expo imports didn't work out
// maybe delete all of this and try start again

import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { Button, Platform, Switch, Text, View } from "react-native";

const DailyReminder = () => {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState(new Date(2020, 0, 1, 7, 30));
  const [showPicker, setShowPicker] = useState(false);
  const notificationId = useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission for notifications not granted!");
    }
  };

  const toggleSwitch = async () => {
    setEnabled((prev) => {
      const newState = !prev;
      if (newState) {
        scheduleNotification(time);
      } else {
        cancelNotification();
      }
      return newState;
    });
  };

  const scheduleNotification = async (date) => {
    cancelNotification();

    // Calcular o próximo horário de disparo
    const now = new Date();
    const triggerDate = new Date();
    triggerDate.setHours(date.getHours());
    triggerDate.setMinutes(date.getMinutes());
    triggerDate.setSeconds(0);

    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete Diário",
        body: "Este é seu lembrete diário!",
      },
      trigger: {
        hour: triggerDate.getHours(),
        minute: triggerDate.getMinutes(),
        repeats: true,
      },
    });

    notificationId.current = id;
  };

  const cancelNotification = async () => {
    if (notificationId.current) {
      await Notifications.cancelScheduledNotificationAsync(
        notificationId.current
      );
      notificationId.current = null;
    }
  };

  const onChange = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      if (enabled) scheduleNotification(selectedTime);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <View
        style={{
          backgroundColor: "#1f1f1f",
          borderRadius: 12,
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text style={{ color: "white", fontSize: 16 }}>Lembrete Diário</Text>
          <Text style={{ color: "#aaa" }}>
            Definido para {time.toTimeString().slice(0, 5)}
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={toggleSwitch}
          trackColor={{ false: "#444", true: "#bb86fc" }}
          thumbColor={enabled ? "#000" : "#888"}
        />
      </View>

      <Button title="Definir Horário" onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DailyReminder;
