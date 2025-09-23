import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { getAllCompanyProfiles, UserProfile } from "../../../services/userService";
import { useRouter } from "expo-router";

export default function CompaniesListScreen() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const companyProfiles = await getAllCompanyProfiles();
      setProfiles(companyProfiles);
    } catch (error) {
      console.error("Error loading profiles:", error);
    }
    setLoading(false);
  };

  const renderProfile = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(dashboard)/page/${item.uid}`)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      {item.logo ? (
        <Image
          source={{ uri: item.logo }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }}
        />
      ) : (
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#e0e0e0",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15,
          }}
        >
          <Text style={{ color: "#666", fontSize: 10 }}>No Logo</Text>
        </View>
      )}
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.companyName}</Text>
        <Text style={{ color: "#666" }}>{item.location || "Location not specified"}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading companies...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={profiles}
      renderItem={renderProfile}
      keyExtractor={(item) => item.uid}
      ListEmptyComponent={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
          <Text>No companies found.</Text>
        </View>
      }
    />
  );
}
