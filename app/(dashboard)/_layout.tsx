import { View, SafeAreaView, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import NotificationService from "@/services/notificationService";
// import job-related services as needed
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  // Initialize notifications when user is logged in
  useEffect(() => {
    const initializeNotifications = async () => {
      if (user) {
        // Initialize notification service
        await NotificationService.initialize();

        // Set up notification response listener
        const subscription =
          NotificationService.setupNotificationResponseListener();

  // Job portal: schedule job-related notifications if needed

        // Schedule meal planning reminders
        try {
          const storedSettings = await AsyncStorage.getItem(
            "notification_settings"
          );
          const settings = storedSettings
            ? JSON.parse(storedSettings)
            : { enabled: true, planningReminders: true };

          if (settings.enabled && settings.planningReminders) {
            // await NotificationService.scheduleJobReminders();
            console.log("Scheduled meal planning reminders on app start");
          }
        } catch (error) {
          console.error("Error scheduling meal planning reminders:", error);
        }

        return () => subscription.remove();
      }
    };

    initializeNotifications();
  }, [user]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused, size, color }) => (
              <MaterialIcons
                name="home"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="companies"
          options={{
            title: "Companies",
            tabBarIcon: ({ focused, size, color }) => (
              <MaterialIcons
                name="business"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ focused, size, color }) => (
              <MaterialIcons
                name="settings"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default DashboardLayout;
