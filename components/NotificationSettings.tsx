import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";
import NotificationService from "../services/notificationService";

// NotificationSettings for job portal (stub)
interface NotificationSettings {
  enabled: boolean;
  jobReminders: boolean;
  notificationTime: string;
}


// Job portal: Notification settings stub
export default function NotificationSettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, color: "#888", textAlign: "center" }}>
        Job notification settings will be available soon.
      </Text>
    </View>
  );
}
