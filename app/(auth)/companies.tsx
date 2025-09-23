import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { getAllCompanies, UserProfile } from "../../services/userService";
import { useRouter } from "expo-router";
import BurgerMenu from "../../components/BurgerMenu";

const CompaniesScreen = () => {
  const [companies, setCompanies] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companyList = await getAllCompanies();
        setCompanies(companyList);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const menuItems = [
    { label: "About", icon: "info" as const, onPress: () => router.push("/about") },
    // { label: "All Jobs", icon: "home" as const, onPress: () => router.push("/(auth)/dashboard") },
    { label: "All Companies", icon: "business" as const, onPress: () => router.push("/(auth)/companies") },
    { label: "Login", icon: "login" as const, onPress: () => router.push("/(auth)/login") },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu title="All Companies" menuItems={menuItems} />
      {/* Description Bar */}
      <View style={styles.descriptionBar}>
        <Text style={styles.descriptionText}>
          Browse and discover the top companies on JobGrid. Find your next opportunity with industry leaders.
        </Text>
      </View>
      {/* Company List */}
      {loading ? (
        <View style={styles.centered}>
          <Text>Loading companies...</Text>
        </View>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.uid?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.companyCard}>
              <Text style={styles.companyName}>{item.companyName}</Text>
              <Text style={styles.companyIndustry}>{item.companyIndustry}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No companies found.</Text>}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  descriptionBar: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#c7d2fe',
  },
  descriptionText: {
    color: '#3730a3',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  companyCard: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "600",
  },
  companyIndustry: {
    fontSize: 14,
    color: "#666",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CompaniesScreen;
