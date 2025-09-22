import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { getJobs, Job } from "../../services/jobService";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const DashboardScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobList = await getJobs();
        setJobs(jobList);
      } catch (error) {
        // Handle error if needed
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar with Burger Menu */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.burgerButton}>
          <MaterialIcons name="menu" size={32} color="#222" />
        </TouchableOpacity>
        <Text style={styles.title}>All Jobs</Text>
      </View>
      {/* Dropdown Menu */}
      {menuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/about"); }}>
            <MaterialIcons name="info" size={20} color="#222" />
            <Text style={styles.menuText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/(auth)/login"); }}>
            <MaterialIcons name="login" size={20} color="#222" />
            <Text style={styles.menuText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/(auth)/register"); }}>
            <MaterialIcons name="person-add" size={20} color="#222" />
            <Text style={styles.menuText}>Register Company</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Job List */}
      {loading ? (
        <View style={styles.centered}>
          <Text>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobCompany}>{item.companyId}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No jobs found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    zIndex: 2,
  },
  burgerButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  menu: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingVertical: 8,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#222",
  },
  jobCard: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  jobCompany: {
    fontSize: 14,
    color: "#666",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DashboardScreen;
