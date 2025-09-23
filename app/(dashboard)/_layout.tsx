import { View, SafeAreaView, ActivityIndicator, Dimensions } from "react-native";
import BurgerMenu from "../../components/BurgerMenu";
import React, { useEffect } from "react";
import { useRouter, Slot } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import NotificationService from "@/services/notificationService";
// import job-related services as needed
import AsyncStorage from "@react-native-async-storage/async-storage";

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = Dimensions.get('window');

  // Removed login redirect so dashboard always shows

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
      <BurgerMenu
        title="Dashboard"
        menuItems={[
          { label: "Home", icon: "home", onPress: () => router.push("/(dashboard)/home") },
          { label: "Profile", icon: "person", onPress: () => router.push("/(dashboard)/profile") },
          { label: "Post", icon: "business", onPress: () => router.push("/(dashboard)/jobs") },
          { label: "Logout", icon: "logout", onPress: async () => { try { await signOut(); router.replace("/(auth)/login"); } catch (e) {} } },
        ]}
      />
      <Slot />
    </SafeAreaView>
  );
};

export default DashboardLayout;
