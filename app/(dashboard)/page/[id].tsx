import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getUserProfile, UserProfile } from "../../../services/userService";

export default function CompanyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProfile(id as string);
    }
  }, [id]);

  const loadProfile = async (uid: string) => {
    setLoading(true);
    try {
      const userProfile = await getUserProfile(uid);
      setProfile(userProfile);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading company details...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Company not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        {profile.logo ? (
          <Image
            source={{ uri: profile.logo }}
            style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
          />
        ) : (
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "#e0e0e0",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#666" }}>No Logo</Text>
          </View>
        )}
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>{profile.companyName}</Text>
      </View>

      <InfoRow label="Email" value={profile.email} />
      <InfoRow label="Location" value={profile.location} />
      <InfoRow label="CEO" value={profile.ceoName} />
      <InfoRow label="Phone" value={profile.phone} />
      <InfoRow label="Description" value={profile.description} multiline />

      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
          Company Gallery
        </Text>
        <FlatList
          data={profile.gallery}
          horizontal
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ width: 80, height: 80, borderRadius: 8, marginRight: 10 }}
            />
          )}
          ListEmptyComponent={<Text style={{ color: "#888" }}>No images uploaded.</Text>}
        />
      </View>
    </ScrollView>
  );
}

const InfoRow = ({ label, value, multiline = false }: { label: string; value?: string; multiline?: boolean }) => {
  if (!value) return null;
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 16,
          padding: 10,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          minHeight: multiline ? 100 : undefined,
        }}
      >
        {value}
      </Text>
    </View>
  );
};
