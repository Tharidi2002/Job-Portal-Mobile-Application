import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, Alert, SafeAreaView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getJobById, Job } from "../../../services/jobService";
import { getUserProfile, UserProfile } from "../../../services/userService";
import { useTheme } from "../../../context/ThemeContext";
import BurgerMenu from "../../../components/BurgerMenu";

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobDetails = async () => {
      if (typeof id !== 'string') return;

      try {
        const jobData = await getJobById(id);
        if (jobData) {
          setJob(jobData);
          const companyData = await getUserProfile(jobData.companyId);
          setCompany(companyData);
        } else {
          Alert.alert("Error", "Job not found.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    loadJobDetails();
  }, [id]);

  if (loading) {
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <BurgerMenu title="Job Details"/>
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10, color: colors.text }}>Loading...</Text>
            </View>
        </SafeAreaView>
    );
  }

  if (!job) {
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <BurgerMenu title="Not Found"/>
            <View style={styles.centered}>
                <Text style={{ color: colors.text, fontSize: 16 }}>Job details not available.</Text>
            </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <BurgerMenu title={job.title} />
        <ScrollView contentContainerStyle={styles.container}>
            {company?.logo && (
            <Image 
                source={{ uri: company.logo }} 
                style={styles.logo}
            />
            )}
            <Text style={[styles.title, { color: colors.text }]}>
            {job.title}
            </Text>

            {company && (
            <Text style={[styles.companyName, { color: colors.text }]}>
                {company.companyName}
            </Text>
            )}

            <Text style={[styles.location, { color: colors.primary }]}>
            {job.location}
            </Text>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Job Description
            </Text>
            <Text style={[styles.description, { color: colors.text }]}>
            {job.description}
            </Text>

            {company && (
            <View style={styles.companySection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                About {company.companyName}
                </Text>
                <Text style={[styles.description, { color: colors.text }]}>
                {company.companyDescription}
                </Text>
            </View>
            )}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 20,
    },
    logo: {
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        alignSelf: 'center', 
        marginBottom: 20, 
        backgroundColor: '#e0e7ff',
    },
    title: {
        fontSize: 26, 
        fontWeight: "bold", 
        textAlign: 'center',
    },
    companyName: {
        fontSize: 18, 
        fontWeight: '600', 
        textAlign: 'center', 
        marginTop: 8,
    },
    location: {
        fontSize: 16, 
        textAlign: 'center', 
        marginTop: 4, 
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20, 
        fontWeight: "bold", 
        marginTop: 20, 
        marginBottom: 10,
    },
    description: {
        fontSize: 16, 
        lineHeight: 24,
    },
    companySection: {
        marginTop: 30, 
        borderTopWidth: 1, 
        borderTopColor: '#ddd', 
        paddingTop: 20,
    }
});
