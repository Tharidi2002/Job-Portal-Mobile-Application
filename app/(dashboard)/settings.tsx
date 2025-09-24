import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { getUserProfile, deleteUserProfile } from "../../services/userService";

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      }
    };
    loadProfile();
  }, [user]);

  // --- Logout
  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/login");
          } catch {
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  // --- Delete Profile
  // const handleDeleteProfile = () => {
  //   Alert.alert(
  //     "Delete Account",
  //     "This will permanently delete your profile and all job data. Do you want to continue?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Delete",
  //         style: "destructive",
  //         onPress: async () => {
  //           try {
  //             if (user) {
  //               await deleteUserProfile(user.uid);
  //             }
  //             await signOut();
  //             router.replace("/(auth)/login");
  //           } catch {
  //             Alert.alert("Error", "Failed to delete account");
  //           }
  //         },
  //       },
  //     ]
  //   );
  // };
  const handleDeleteProfile = () => {
  Alert.alert(
    "Delete Account",
    "This will permanently delete your profile and all job data. Do you want to continue?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // TODO: Add delete logic here (e.g., call deleteUserProfile(user.uid))
            // Example:
            // if (user) {
            //   await deleteUserProfile(user.uid);
            // }

            // For now, just sign out and navigate to login
            await signOut();
            router.replace("/(auth)/login");
          } catch (error) {
            Alert.alert("Error", "Failed to delete account");
          }
        },
      },
    ]
  );
};


  // --- Reusable Section
  const SettingsSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-4 uppercase tracking-wide">
        {title}
      </Text>
      <View className="bg-white dark:bg-gray-800 mx-4 rounded-xl overflow-hidden">
        {children}
      </View>
    </View>
  );

  // --- Reusable Item
  const SettingsItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    showChevron = true,
    isLast = false,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center p-4 ${
        isLast ? "" : "border-b border-gray-200 dark:border-gray-700"
      }`}
    >
      <View className="bg-blue-500 w-10 h-10 rounded-full justify-center items-center mr-4">
        <MaterialIcons name={icon} size={20} color="white" />
      </View>

      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </Text>
        )}
      </View>

      {rightElement ||
        (showChevron && onPress && (
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={isDark ? "gray" : "gray"}
          />
        ))}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-black">
      {/* Header */}
      <View className="p-6 items-center">
        <View className="w-20 h-20 rounded-full bg-blue-500 justify-center items-center mb-4">
          <MaterialIcons name="person" size={40} color="white" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {userProfile?.firstName && userProfile?.lastName
            ? `${userProfile.firstName} ${userProfile.lastName}`
            : "Company"}
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400">
          {user?.email}
        </Text>
      </View>

      {/* Account Section */}
      <SettingsSection title="Account">
        <SettingsItem
          icon="person"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => router.push("/profile")}
        />
        <SettingsItem
          icon="security"
          title="Privacy & Security"
          subtitle="Manage your account security"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature will be available soon")
          }
          isLast
        />
      </SettingsSection>

      {/* App Settings */}
      <SettingsSection title="App Settings">
        <SettingsItem
          icon="palette"
          title="Dark Mode"
          subtitle={`Currently using ${isDark ? "dark" : "light"} theme`}
          onPress={toggleTheme}
          rightElement={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
              thumbColor={isDark ? "white" : "#9ca3af"}
            />
          }
          showChevron={false}
        />
        <SettingsItem
          icon="notifications"
          title="Notifications"
          subtitle="Manage job alerts and updates"
          onPress={() => router.push("/notifications" as any)}
        />
        <SettingsItem
          icon="language"
          title="Language"
          subtitle="English"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature will be available soon")
          }
          isLast
        />
      </SettingsSection>

      {/* Data & Storage */}
      <SettingsSection title="Data & Storage">
        <SettingsItem
          icon="backup"
          title="Backup & Sync"
          subtitle="Your job data is automatically backed up"
          onPress={() =>
            Alert.alert(
              "Backup Status",
              "Your job application data is safely stored in the cloud"
            )
          }
        />
        <SettingsItem
          icon="storage"
          title="Storage Usage"
          subtitle="Manage saved resumes and documents"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature will be available soon")
          }
        />
        <SettingsItem
          icon="download"
          title="Export Data"
          subtitle="Download your job application data"
          onPress={() =>
            Alert.alert("Coming Soon", "This feature will be available soon")
          }
          isLast
        />
      </SettingsSection>

      {/* Support */}
      <SettingsSection title="Support">
        <SettingsItem
          icon="help"
          title="Help & FAQ"
          subtitle="Get answers to common questions"
          onPress={() =>
            Alert.alert(
              "Help",
              "For support, please contact us at support@jobportal.com"
            )
          }
        />
        <SettingsItem
          icon="feedback"
          title="Send Feedback"
          subtitle="Help us improve Job Portal"
          onPress={() =>
            Alert.alert(
              "Feedback",
              "Thank you for using Job Portal! Send feedback to feedback@jobportal.com"
            )
          }
        />
        <SettingsItem
          icon="star"
          title="Rate the App"
          subtitle="Share your experience"
          onPress={() =>
            Alert.alert(
              "Rate Job Portal",
              "Thank you for your support! Please rate us on the app store."
            )
          }
        />
        <SettingsItem
          icon="info"
          title="About Job Portal"
          subtitle="Version 1.0.0"
          onPress={() =>
            Alert.alert(
              "About Job Portal",
              "Job Portal v1.0.0\n\nYour career companion.\n\nDeveloped with ❤️ for job seekers and recruiters."
            )
          }
          isLast
        />
      </SettingsSection>

      {/* Sign Out & Delete */}
      <View className="mx-4 mb-8">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-4 px-6 rounded-xl flex-row items-center justify-center mb-3"
        >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text className="text-white text-base font-semibold ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteProfile}
          className="bg-red-700 py-4 px-6 rounded-xl flex-row items-center justify-center"
        >
          <MaterialIcons name="delete" size={20} color="white" />
          <Text className="text-white text-base font-semibold ml-2">
            Delete Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="p-4 items-center border-t border-gray-200 dark:border-gray-700 mt-4">
        <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-1">
          Job Portal - Your Career Companion
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-[10px] text-center">
          Made with for job seekers & employers
        </Text>
      </View>
    </ScrollView>
  );
}
