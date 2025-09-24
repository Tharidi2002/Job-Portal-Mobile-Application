import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getJobs, Job } from "../../services/jobService";
import { getAllCompanies, UserProfile } from "../../services/userService";

export default function HomeScreen() {
  const [companies, setCompanies] = useState<UserProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const companyList = await getAllCompanies();
        const jobList = await getJobs();
        setCompanies(companyList);
        setJobs(jobList);
      } catch (e) {
        setCompanies([]);
        setJobs([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Helper: count jobs for a company
  const getJobCount = (companyId: string) =>
    jobs.filter((job) => job.companyId === companyId).length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Company Profiles</Text>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          setCompanies([]);
          setJobs([]);
        }}
      >
        <Text style={styles.clearButtonText}>Clear Data</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
      ) : companies.length === 0 ? (
        <Text style={styles.emptyText}>No companies found.</Text>
      ) : (
        companies.map((company) => (
          <View key={company.uid} style={styles.card}>
            {company.logo && (
              <Image source={{ uri: company.logo }} style={styles.logo} />
            )}
            <Text style={styles.title}>{company.companyName}</Text>
            <Text style={styles.subtitle}>{company.location}</Text>
            <Text style={styles.description}>{company.description}</Text>
            <Text style={styles.jobCount}>Jobs Posted: {getJobCount(company.uid)}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert(
                  "Delete Company",
                  "Are you sure you want to permanently delete this company and all its job postings?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => {
                        setCompanies(prev => prev.filter(c => c.uid !== company.uid));
                        setJobs(prev => prev.filter(j => j.companyId !== company.uid));
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      {/* Summary Section */}
      {!loading && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Total Companies: {companies.length}</Text>
          <Text style={styles.summaryText}>Total Jobs: {jobs.length}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 10,
    backgroundColor: "#e0e7ff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  jobCount: {
    fontSize: 15,
    color: "#3730a3",
    fontWeight: "bold",
    marginTop: 4,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    marginVertical: 20,
    textAlign: "center",
  },
  summaryBox: {
    backgroundColor: "#e0e7ff",
    borderRadius: 10,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
    marginBottom: 4,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
