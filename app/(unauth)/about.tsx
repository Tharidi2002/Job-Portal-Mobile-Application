import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import BurgerMenu from "../../components/BurgerMenu";
import { useTheme } from "../../context/ThemeContext";

const AboutScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <BurgerMenu title="About" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>About JobGrid</Text>
        <Text style={[styles.subtitle, { color: colors.primary }]}>Your Professional Job Posting Platform</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          JobGrid is a modern job posting and recruitment platform designed to connect top companies with talented job seekers. Our mission is to make job discovery and hiring simple, transparent, and effective for everyone.
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          • Browse and search job postings from leading companies
          {`\n`}• Register your company and post job vacancies easily
          {`\n`}• Manage your company profile and job listings
          {`\n`}• Apply for jobs and track your applications
          {`\n`}• Secure, user-friendly, and mobile-optimized experience
        </Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact & Support</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          For support or inquiries, please contact us at:
          {`\n`}Email: support@jobgrid.com
          {`\n`}Phone: +1 (800) 123-4567
        </Text>
        <Text style={[styles.footer, { color: colors.text, opacity: 0.6 }]}>© {new Date().getFullYear()} JobGrid. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 18,
  },
  paragraph: {
    fontSize: 15,
    marginBottom: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  footer: {
    fontSize: 13,
    marginTop: 32,
    textAlign: "center",
  },
});

export default AboutScreen;
