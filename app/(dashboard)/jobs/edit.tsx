import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { getJobById, updateJob, Job } from "../../../services/jobService";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditJobScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<Job | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadJob(id as string);
    }
  }, [id]);

  const loadJob = async (jobId: string) => {
    setLoading(true);
    try {
      const jobData = await getJobById(jobId);
      if (jobData) {
        const jobTyped = jobData as Job;
        setJob(jobTyped);
        setTitle(jobTyped.title || "");
        setDescription(jobTyped.description || "");
        setLocation(jobTyped.location || "");
        setSalary(jobTyped.salary || "");
        setImage(jobTyped.image || "");
      } else {
        setJob(null);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load job");
      setJob(null);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title || !description || !location) {
      Alert.alert("Validation", "Title, description, and location are required.");
      return;
    }

    const saveConfirmed = Platform.OS === 'web' 
      ? window.confirm("Are you sure you want to save these changes?")
      : await new Promise(resolve => {
          Alert.alert(
            "Save Changes",
            "Are you sure you want to save these changes?",
            [
              { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
              {
                text: "Save",
                style: "default",
                onPress: () => resolve(true),
              },
            ],
            { cancelable: false }
          );
        });

    if (saveConfirmed) {
      setIsSaving(true);
      try {
        const jobId = id as string;
        await updateJob(jobId, {
          title,
          description,
          location,
          salary,
          image,
        });

        if (Platform.OS === 'web') {
          window.alert("Job updated successfully!");
          router.replace('/(dashboard)/jobs');
        } else {
          Alert.alert("Success", "Job updated successfully!", [
            { text: "OK", onPress: () => router.replace('/(dashboard)/jobs') }
          ]);
        }
      } catch (e) {
        Alert.alert("Error", "Failed to update job");
      }
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 12 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, marginBottom: 20 }}>
          Edit Job
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
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
