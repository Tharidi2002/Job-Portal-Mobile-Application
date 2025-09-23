import { register } from "@/services/authService";
import { createUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [companyName, setCompanyName] = React.useState<string>("");
  const [logo, setLogo] = React.useState<string>("");
  const [logoError, setLogoError] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  // Image picker handler
  const pickLogo = async () => {
    setLogoError("");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setLogoError("Please allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLogo(result.assets[0].uri);
    } else if (result.canceled) {
      setLogoError("Logo selection cancelled.");
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !companyName) {
      alert("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await register(email, password);
      const user = userCredential.user;
      // Create company profile
      await createUserProfile({
        uid: user.uid,
        email: user.email || email,
        companyName,
        logo: logo || "",
        createdAt: new Date().toISOString(),
      });
      router.replace("/home");
    } catch (err) {
      alert("Registration Failed");
      console.error("Registration Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#e0e7ff', '#f0fdfa', '#f9fafb']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
    >
      <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 24, padding: 28, shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 18, elevation: 8 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#1e293b', letterSpacing: 1 }}>Company Registration</Text>
        <Text style={{ fontSize: 17, textAlign: 'center', marginBottom: 22, color: '#64748b' }}>Register your company account</Text>

        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          {logo ? (
            <View style={{ position: 'relative', width: 120, height: 120, marginBottom: 8 }}>
              <Image
                source={{ uri: logo }}
                style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#6366f1', backgroundColor: '#c7d2fe' }}
              />
              <TouchableOpacity
                style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#fff', borderRadius: 12, padding: 2, borderWidth: 1, borderColor: '#e5e7eb', elevation: 2 }}
                onPress={() => setLogo("")}
              >
                <Text style={{ fontSize: 16, color: '#ef4444', fontWeight: 'bold' }}>✖</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#6366f1', marginBottom: 8, elevation: 2 }}
              onPress={pickLogo}
            >
              <Text style={{ fontSize: 36, color: '#6366f1', marginBottom: 4 }}>⬆️</Text>
              <Text style={{ color: '#6366f1', fontWeight: '600' }}>Upload Logo</Text>
            </TouchableOpacity>
          )}
          {logoError ? <Text style={{ color: '#ef4444', marginTop: 4 }}>{logoError}</Text> : null}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, marginBottom: 14, borderWidth: 1, borderColor: '#e0e7ff' }}>
          <Text style={{ fontSize: 18, color: '#6366f1', marginLeft: 12 }}>🏢</Text>
          <TextInput
            placeholder="Company Name *"
            placeholderTextColor="#94a3b8"
            value={companyName}
            onChangeText={setCompanyName}
            style={{
              padding: 14,
              fontSize: 16,
              backgroundColor: 'transparent',
              flex: 1,
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, marginBottom: 14, borderWidth: 1, borderColor: '#e0e7ff' }}>
          <Text style={{ fontSize: 18, color: '#6366f1', marginLeft: 12 }}>✉️</Text>
          <TextInput
            placeholder="Email *"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              padding: 14,
              fontSize: 16,
              backgroundColor: 'transparent',
              flex: 1,
            }}
          />
        </View>
        <View style={{ position: 'relative', width: '100%', marginBottom: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff' }}>
          <Text style={{ fontSize: 18, color: '#6366f1', marginLeft: 12 }}>🔒</Text>
          <TextInput
            placeholder="Password *"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{
              padding: 14,
              fontSize: 16,
              backgroundColor: 'transparent',
              flex: 1,
              paddingRight: 48,
            }}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 12, top: 0, height: '100%', justifyContent: 'center' }}
            onPress={() => setShowPassword((v) => !v)}
          >
            <Text style={{ fontSize: 18, color: '#6366f1' }}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ position: 'relative', width: '100%', marginBottom: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff' }}>
          <Text style={{ fontSize: 18, color: '#6366f1', marginLeft: 12 }}>🔒</Text>
          <TextInput
            placeholder="Confirm Password *"
            placeholderTextColor="#94a3b8"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={{
              padding: 14,
              fontSize: 16,
              backgroundColor: 'transparent',
              flex: 1,
              paddingRight: 48,
            }}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 12, top: 0, height: '100%', justifyContent: 'center' }}
            onPress={() => setShowConfirmPassword((v) => !v)}
          >
            <Text style={{ fontSize: 18, color: '#6366f1' }}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: '#6366f1', padding: 16, borderRadius: 12, marginTop: 8, marginBottom: 4, shadowColor: '#6366f1', shadowOpacity: 0.14, shadowRadius: 10, elevation: 3 }}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={{ fontSize: 18, textAlign: 'center', color: '#fff', fontWeight: '700', letterSpacing: 0.5 }}>Register</Text>
          )}
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', marginTop: 16, color: '#64748b', fontSize: 15 }}>Already have an account?</Text>
        <Pressable
          style={{ backgroundColor: '#22c55e', padding: 14, borderRadius: 10, marginTop: 10, shadowColor: '#22c55e', shadowOpacity: 0.12, shadowRadius: 8, elevation: 2 }}
          onPress={() => router.push("/login")}
        >
          <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center', fontWeight: '700' }}>Go to Login</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default Register;
