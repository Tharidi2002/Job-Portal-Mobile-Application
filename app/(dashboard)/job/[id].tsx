import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getJobById, Job } from "../../../services/jobService";

export default function JobDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState<Job | null>(null);
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
      setJob(jobData as Job);
    } catch (e) {
      Alert.alert("Error", "Failed to load job details");
      setJob(null);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 12 }}>Loading...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>Job not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text }}>
          {job.title}
        </Text>
        <Text style={{ color: colors.text, marginTop: 8 }}>
          {job.companyId || "Company"} • {job.location}
        </Text>
        <Text style={{ color: colors.text, marginTop: 16, fontSize: 16 }}>
          {job.description}
        </Text>
        {job.salary && (
          <Text style={{ color: colors.text, marginTop: 16, fontWeight: "bold" }}>
            Salary: {job.salary}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
