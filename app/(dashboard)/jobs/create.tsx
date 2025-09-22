import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { createJob, uploadImageToCloudinary } from "../../../services/jobService";
import { useRouter } from "expo-router";

export default function CreateJobScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !description || !location) {
      Alert.alert("Validation", "Title, description, and location are required.");
      return;
    }
    setIsSaving(true);
    try {
      await createJob({
  companyId: user?.uid || "",
        title,
        description,
        location,
        salary,
        image,
      });
      Alert.alert("Success", "Job created successfully!", [
  { text: "OK", onPress: () => router.replace({ pathname: "/(dashboard)/jobs" }) }
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to create job");
    }
    setIsSaving(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, marginBottom: 20 }}>
          Create Job
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Job Title"
          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: colors.text }}
          placeholderTextColor={colors.text}
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Job Description"
          multiline
          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, minHeight: 100, color: colors.text }}
          placeholderTextColor={colors.text}
        />
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Location"
          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: colors.text }}
          placeholderTextColor={colors.text}
        />
        <TextInput
          value={salary}
          onChangeText={setSalary}
          placeholder="Salary (optional)"
          style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 16, color: colors.text }}
          placeholderTextColor={colors.text}
        />
        {/* Image upload can be added here if needed */}
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: "center", marginTop: 8 }}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Create Job</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
