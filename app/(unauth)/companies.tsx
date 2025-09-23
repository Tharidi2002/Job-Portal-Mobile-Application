import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl 
} from "react-native";
import { getAllCompanies, UserProfile } from "../../services/userService";
import { useRouter } from "expo-router";
import BurgerMenu from "../../components/BurgerMenu";
import { useTheme } from "../../context/ThemeContext";

const CompaniesListScreen = () => {
  const [companies, setCompanies] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const companyList = await getAllCompanies();
      setCompanies(companyList);
    } catch (e) {
      console.error("Failed to fetch companies:", e);
      setError("Failed to load companies. Please pull down to refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompanies().finally(() => setRefreshing(false));
  }, [fetchCompanies]);

  const handleCompanyPress = (company: UserProfile) => {
    router.push(`/(unauth)/companies/${company.uid}`);
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10, color: colors.text }}>Loading companies...</Text>
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
        data={companies}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.companyCard, { backgroundColor: colors.card }]} onPress={() => handleCompanyPress(item)}>
            <Image
              source={item.logo ? { uri: item.logo } : require("../../assets/images/icon.png")}
              style={styles.logo}
            />
            <View style={styles.companyInfo}>
              <Text style={[styles.companyName, { color: colors.text }]}>{item.companyName}</Text>
              <Text style={styles.companyIndustry}>{item.companyIndustry}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={{ color: colors.text }}>No companies found.</Text>
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
      <BurgerMenu title="All Companies" />
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
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  companyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    backgroundColor: "#e0e7ff",
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "600",
  },
  companyIndustry: {
    fontSize: 14,
    color: "#666",
  },
});

export default CompaniesListScreen;
