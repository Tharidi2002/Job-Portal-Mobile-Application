import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { getJobs, deleteJob, Job } from "../../../services/jobService";
import { useRouter } from "expo-router";

export default function CompanyJobsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const allJobs = await getJobs();
      setJobs(allJobs.filter((j: Job) => j.companyId === user?.uid));
    } catch (e) {
      setJobs([]);
      Alert.alert("Error", "Failed to load jobs");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id: string) => {
    const deleteConfirmed = Platform.OS === 'web' 
      ? window.confirm("Are you sure you want to delete this job?")
      : await new Promise(resolve => {
          Alert.alert(
            "Delete Job",
            "Are you sure you want to delete this job?",
            [
              { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => resolve(true),
              },
            ],
            { cancelable: false }
          );
        });

    if (deleteConfirmed) {
      try {
        await deleteJob(id);
        loadJobs();
      } catch (error) {
        Alert.alert("Error", "Failed to delete job.");
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text }}>
          My Job Postings
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: colors.primary,
            padding: 12,
            borderRadius: 8,
            alignSelf: "flex-start",
          }}
          onPress={() => router.push("/(dashboard)/jobs/create")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Add Job</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 24 }} color={colors.primary} />
        ) : jobs.length === 0 ? (
          <Text style={{ marginTop: 24, color: colors.text }}>
            No jobs posted yet.
          </Text>
        ) : (
          jobs.map((job) => (
            <View
              key={job.id}
              style={{
                backgroundColor: colors.card,
                borderRadius: 10,
                padding: 16,
                marginTop: 16,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
                {job.title}
              </Text>
              <Text style={{ color: colors.text, marginTop: 4 }}>
                {job.location}
              </Text>
              <Text style={{ color: colors.text, marginTop: 8 }} numberOfLines={2}>
                {job.description}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 12 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    padding: 8,
                    borderRadius: 6,
                    marginRight: 10,
                  }}
                  onPress={() => router.push(`/(dashboard)/jobs/edit?id=${job.id}`)}
                >
                  <Text style={{ color: "#fff" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FF3B30",
                    padding: 8,
                    borderRadius: 6,
                  }}
                  onPress={() => handleDelete(job.id!)}
                >
                  <Text style={{ color: "#fff" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
