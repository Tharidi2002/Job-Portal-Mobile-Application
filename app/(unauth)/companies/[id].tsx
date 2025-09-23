import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  RefreshControl, 
  TouchableOpacity
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getUserProfile, UserProfile } from "../../../services/userService";
import { getJobsByCompany, Job } from "../../../services/jobService";
import { useTheme } from "../../../context/ThemeContext";

export default function CompanyProfileScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  
  const [company, setCompany] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyData = useCallback(async () => {
    if (typeof id !== 'string') return;

    setLoading(true);
    setError(null);
    try {
      const companyData = await getUserProfile(id);
      if (!companyData) {
        throw new Error("Company not found.");
      }
      setCompany(companyData);
      
      const companyJobs = await getJobsByCompany(id);
      setJobs(companyJobs);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      console.error("Failed to fetch company data:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompanyData().finally(() => setRefreshing(false));
  }, [fetchCompanyData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10, color: colors.text }}>Loading company details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  if (!company) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text }}>Company not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ padding: 20 }}>
        {company.logo && (
          <Image 
            source={{ uri: company.logo }} 
            style={styles.logo}
          />
        )}
        <Text style={[styles.companyName, { color: colors.text }]}>
          {company.companyName}
        </Text>
        <Text style={[styles.companyIndustry, { color: colors.primary }]}>
          {company.companyIndustry}
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {company.companyDescription}
        </Text>

        <View style={styles.jobsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Jobs at {company.companyName}</Text>
          {jobs.length > 0 ? (
            jobs.map(job => (
              <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => router.push(`/(unauth)/jobs/${job.id}`)}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobLocation}>{job.location}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: colors.text, textAlign: 'center', marginTop: 10 }}>No open positions at the moment.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f9fafb',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#e0e7ff',
  },
  companyName: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: 'center',
  },
  companyIndustry: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  jobsSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  jobCard: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  jobLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
