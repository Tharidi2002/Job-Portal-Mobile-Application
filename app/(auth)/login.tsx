
import { StyleSheet } from "react-native";

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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.08)',
    zIndex: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuBox: {
    marginTop: 70,
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
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { login } from "@/services/authService";
import { LinearGradient } from "expo-linear-gradient";

const Login = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace("/home");
    } catch (err) {
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again"
      );
      console.error("Login Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const { width } = Dimensions.get('window');
  return (
    <LinearGradient colors={["#e0e7ff", "#f0fdfa", "#f9fafb"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "transparent" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Top Bar with Burger Menu */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.burgerButton}>
            <MaterialIcons name="menu" size={32} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>Login</Text>
        </View>
        {/* Dropdown Menu Overlay */}
        {menuOpen && (
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          >
            <View style={[styles.menuBox, { width: width - 32 }]}> 
              <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8, marginLeft: 8 }}>Navigation</Text>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/about"); }}>
                <MaterialIcons name="info" size={20} color="#222" />
                <Text style={styles.menuText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/dashboard"); }}>
                <MaterialIcons name="dashboard" size={20} color="#222" />
                <Text style={styles.menuText}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/(auth)/login"); }}>
                <MaterialIcons name="login" size={20} color="#222" />
                <Text style={styles.menuText}>Login</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}


        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: 24,
              paddingVertical: 48,
            }}
          >
            {/* App Logo/Icon */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 48,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 24,
                  shadowColor: colors.text,
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <MaterialIcons name="business" size={50} color="white" />
              </View>

              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "bold",
                  color: colors.text,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Company Login
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  textAlign: "center",
                }}
              >
                Sign in to manage your company and job postings
              </Text>
            </View>

            {/* Email Input */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Email Address
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                }}
              >
                <MaterialIcons
                  name="email"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={{
                    flex: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                }}
              >
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{
                    flex: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    fontSize: 16,
                    color: colors.text,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ padding: 4 }}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 12,
                marginBottom: 16,
                shadowColor: colors.primary,
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 8,
                elevation: 4,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 24,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: colors.border,
                }}
              />
              <Text
                style={{
                  paddingHorizontal: 16,
                  color: colors.textSecondary,
                  fontSize: 14,
                }}
              >
                New company?
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: colors.border,
                }}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={() => router.push("/register")}
              style={{
                borderWidth: 2,
                borderColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 12,
                backgroundColor: "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Register Company
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View
              style={{
                marginTop: 48,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  textAlign: "center",
                }}
              >
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Login;
