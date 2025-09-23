import { View, SafeAreaView, ActivityIndicator } from "react-native";
import BurgerMenu from "../../components/BurgerMenu";
import React from "react";
import { useRouter, Slot, usePathname } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const getTitle = (pathname: string) => {
    switch (pathname) {
      case "/(dashboard)/home":
        return "Home";
      case "/(dashboard)/profile":
        return "Profile";
      case "/(dashboard)/post-job":
        return "Post Job";
      default:
        if (pathname.startsWith("/(dashboard)/jobs/")) {
          return "Job Details";
        }
        return "Dashboard";
    }
  };

  const title = getTitle(pathname);


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
        title={title}
        menuItems={[
          { label: "Home", icon: "home", onPress: () => router.push("/(dashboard)/home") },
          { label: "Profile", icon: "person", onPress: () => router.push("/(dashboard)/profile") },
          { label: "Post Job", icon: "add-business", onPress: () => router.push("/(dashboard)/post-job") },
          { label: "Logout", icon: "logout", onPress: async () => { try { await signOut(); router.replace("/(auth)/login"); } catch (e) {} } },
        ]}
      />
      <Slot />
    </SafeAreaView>
  );
};

export default DashboardLayout;
