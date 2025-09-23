import React from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const BurgerMenu: React.FC<{ title: string }> = ({ title }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/(unauth)/"); 
  };

  const unauthMenuItems = [
    { label: "All Jobs", icon: "home" as const, onPress: () => router.push("/(unauth)/") },
    { label: "All Companies", icon: "business" as const, onPress: () => router.push("/(unauth)/companies") },
    { label: "About", icon: "info" as const, onPress: () => router.push("/(unauth)/about") },
    { label: "Login", icon: "login" as const, onPress: () => router.push("/(auth)/login") },
    { label: "Sign Up", icon: "person-add" as const, onPress: () => router.push("/(auth)/signup") },
  ];

  const authMenuItems = [
    { label: "Dashboard", icon: "dashboard" as const, onPress: () => router.push("/(dashboard)/home") },
    { label: "My Profile", icon: "person" as const, onPress: () => router.push("/(dashboard)/profile") },
    { label: "Post a Job", icon: "add-to-photos" as const, onPress: () => router.push("/(dashboard)/jobs/new") },
    { label: "Logout", icon: "logout" as const, onPress: handleSignOut },
  ];

  const menuItems = user ? authMenuItems : unauthMenuItems;

  return (
    <>
      <View style={[styles.topBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.burgerButton}>
          <MaterialIcons name="menu" size={32} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      
      {menuOpen && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={[styles.menu, { backgroundColor: colors.card }]}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={async () => {
                  setMenuOpen(false);
                  await item.onPress();
                }}
              >
                <MaterialIcons name={item.icon} size={20} color={colors.text} />
                <Text style={[styles.menuText, { color: colors.text }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  burgerButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: 100,
  },
  menu: {
    position: 'absolute',
    top: 60, 
    left: 16,
    width: width * 0.7,
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
  },
});

export default BurgerMenu;
