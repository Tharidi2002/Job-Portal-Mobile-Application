import React, { useEffect, useState, useMemo, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput,
  RefreshControl
} from "react-native";
import { getAllJobs, Job } from "../../services/jobService";
import { useRouter } from "expo-router";
import BurgerMenu from "../../components/BurgerMenu";
import { useTheme } from "../../context/ThemeContext";

const HomeScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const jobList = await getAllJobs();
      setJobs(jobList);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs().finally(() => setRefreshing(false));
  }, [fetchJobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={[styles.jobCard, { backgroundColor: colors.card }]} 
      onPress={() => router.push(`/(unauth)/jobs/${item.id}`)}
    >
      <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.jobLocation, { color: colors.primary }]}>{item.location}</Text>
      <Text style={[styles.jobSalary, { color: colors.text }]}>{item.salary}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10, color: colors.text }}>Loading jobs...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={{ color: colors.text }}>No jobs found.</Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <BurgerMenu title="All Jobs" />
      <TextInput 
          style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholderTextColor={colors.text}
          placeholder="Search for jobs or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
      />
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    jobCard: {
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 2, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    jobLocation: {
        fontSize: 14,
        marginTop: 4,
    },
    jobSalary: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 8,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginHorizontal: 16,
        marginBottom: 10,
    },
});

export default HomeScreen;
