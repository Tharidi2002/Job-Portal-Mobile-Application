import React from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface MenuItem {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void | Promise<void>;
}

interface BurgerMenuProps {
  title: string;
  menuItems: MenuItem[];
}

const { width } = Dimensions.get("window");

const BurgerMenu: React.FC<BurgerMenuProps> = ({ title, menuItems }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <>
      {/* Top Bar with Burger Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.burgerButton}>
          <MaterialIcons name="menu" size={32} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      {/* Dropdown Menu Overlay */}
      {menuOpen && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menu}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={async () => {
                  setMenuOpen(false);
                  await item.onPress();
                }}
              >
                <MaterialIcons name={item.icon} size={20} color="#222" />
                <Text style={styles.menuText}>{item.label}</Text>
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
    paddingTop: 40,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    zIndex: 2,
  },
  burgerButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.08)",
    zIndex: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  menu: {
    marginTop: 70,
    width: width - 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 12,
    paddingVertical: 8,
    zIndex: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#222",
  },
});

export default BurgerMenu;
