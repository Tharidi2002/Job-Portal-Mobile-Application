import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { getJobs, Job } from "../../services/jobService";

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [jobListings, setJobListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  // Fetch job listings from jobService
  const loadData = async () => {
    setLoading(true);
    try {
      const jobs: Job[] = await getJobs();
      setJobListings(jobs);
    } catch (e) {
      setJobListings([]);
      Alert.alert("Error", "Failed to load jobs");
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }
    >
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text }}>
          Job Listings
        </Text>
        {loading ? (
          <Text style={{ marginTop: 16, color: colors.text }}>Loading...</Text>
        ) : jobListings.length === 0 ? (
          <Text style={{ marginTop: 16, color: colors.text }}>
            No jobs available.
          </Text>
        ) : (
          jobListings.map((job) => (
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
                {job.companyName || "Company"} • {job.location}
              </Text>
              <Text style={{ color: colors.text, marginTop: 8 }} numberOfLines={2}>
                {job.description}
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 12,
                  backgroundColor: colors.primary,
                  padding: 10,
                  borderRadius: 6,
                  alignSelf: "flex-start",
                }}
                onPress={() => router.push(`/(dashboard)/jobs/${job.id}`)}
              >
                <Text style={{ color: "#fff" }}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
