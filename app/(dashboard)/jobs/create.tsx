import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { createJob } from "../../../services/jobService";
import { useRouter } from "expo-router";

export default function CreateJobScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
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
      });

      if (Platform.OS === 'web') {
        window.alert("Job created successfully!");
        router.replace(`/(dashboard)/jobs`);
      } else {
        Alert.alert("Success", "Job created successfully!", [
          { text: "OK", onPress: () => router.replace(`/(dashboard)/jobs`) }
        ]);
      }
    } catch (e) {
      console.error("Failed to create job:", e);
      Alert.alert("Error", "Failed to create job. Please check the console for more details.");
    }
    setIsSaving(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 24,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    descriptionInput: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create a New Job</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Job Title"
        style={styles.input}
        placeholderTextColor={colors.text}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Job Description"
        multiline
        style={[styles.input, styles.descriptionInput]}
        placeholderTextColor={colors.text}
      />
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Location (e.g., San Francisco, CA)"
        style={styles.input}
        placeholderTextColor={colors.text}
      />
      <TextInput
        value={salary}
        onChangeText={setSalary}
        placeholder="Salary (e.g., $100,000 - $120,000)"
        style={styles.input}
        placeholderTextColor={colors.text}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Job</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
