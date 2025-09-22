import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  createOrUpdateUserProfile,
  UserProfile,
} from "@/services/userService";
import * as ImagePicker from "expo-image-picker";

export default function CompanyProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState("");
  const [location, setLocation] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (user?.uid && user?.email) {
      setIsLoading(true);
      try {
        let userProfile = await getUserProfile(user.uid);
        if (!userProfile && user.email) {
          await createOrUpdateUserProfile(user.uid, user.email, {
            companyName: "",
          });
          userProfile = await getUserProfile(user.uid);
        }
        if (userProfile) {
          setProfile(userProfile);
          setLocation(userProfile.location || "");
          setDescription(userProfile.description || "");
          setPhone(userProfile.phone || "");
          setGallery(userProfile.gallery || []);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const pickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLogo(result.assets[0].uri);
    }
  };

  const addGalleryImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setGallery([...gallery, result.assets[0].uri]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user?.uid || !user?.email) return;
    setIsSaving(true);
    try {
      await createOrUpdateUserProfile(user.uid, user.email, {
        companyName,
        logo,
        location,
        ceoName,
        description,
        phone,
        gallery,
      });
      await loadProfile();
      setIsEditing(false);
      Alert.alert("Success", "Company profile updated successfully!");
    } catch (error) {
      console.error("Error updating company profile:", error);
      Alert.alert("Error", "Failed to update company profile");
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = () => {
    // Reset form fields to original values
    setPhone(profile?.phone || "");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading company profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={isEditing ? pickLogo : undefined}>
          {logo ? (
            <Image
              source={{ uri: logo }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 10,
              }}
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
          {isEditing && (
            <Text style={{ textAlign: "center", color: "#007AFF" }}>
              Tap to change logo
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          Company Name
        </Text>
        {isEditing ? (
          <TextInput
            value={companyName}
            onChangeText={setCompanyName}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 8,
              fontSize: 16,
            }}
            placeholder="Enter company name"
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            {profile?.companyName || "Not set"}
          </Text>
        )}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          Email
        </Text>
        <Text
          style={{
            fontSize: 16,
            padding: 10,
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            color: "#666",
          }}
        >
          {user?.email}
        </Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          Location
        </Text>
        {isEditing ? (
          <TextInput
            value={location}
            onChangeText={setLocation}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 8,
              fontSize: 16,
            }}
            placeholder="Enter company location"
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            {profile?.location || "Not set"}
          </Text>
        )}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          CEO Name
        </Text>
        {isEditing ? (
          <TextInput
            value={ceoName}
            onChangeText={setCeoName}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 8,
              fontSize: 16,
            }}
            placeholder="Enter CEO name"
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            {profile?.ceoName || "Not set"}
          </Text>
        )}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          Phone
        </Text>
        {isEditing ? (
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 8,
              fontSize: 16,
            }}
            placeholder="Enter phone number"
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
            }}
          >
            {profile?.phone || "Not set"}
          </Text>
        )}
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          Description
        </Text>
        {isEditing ? (
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 8,
              fontSize: 16,
              height: 100,
              textAlignVertical: "top",
            }}
            placeholder="Describe your company"
            multiline
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              padding: 10,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
              minHeight: 100,
            }}
          >
            {profile?.description || "No description added"}
          </Text>
        )}
      </View>

      {/* Gallery Section */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
          Company Gallery
        </Text>
        <FlatList
          data={gallery}
          horizontal
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <View style={{ marginRight: 10, position: "relative" }}>
              <Image
                source={{ uri: item }}
                style={{ width: 80, height: 80, borderRadius: 8 }}
              />
              {isEditing && (
                <TouchableOpacity
                  onPress={() => removeGalleryImage(index)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "#FF3B30",
                    borderRadius: 10,
                    padding: 2,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#888" }}>
              {isEditing ? "No images. Add some!" : "No images uploaded."}
            </Text>
          }
        />
        {isEditing && (
          <TouchableOpacity
            onPress={addGalleryImage}
            style={{
              backgroundColor: "#007AFF",
              padding: 10,
              borderRadius: 8,
              marginTop: 10,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "white" }}>Add Image</Text>
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={handleCancel}
            style={{
              backgroundColor: "#ccc",
              padding: 15,
              borderRadius: 8,
              flex: 1,
              marginRight: 10,
            }}
            disabled={isSaving}
          >
            <Text style={{ textAlign: "center", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: "#007AFF",
              padding: 15,
              borderRadius: 8,
              flex: 1,
              marginLeft: 10,
            }}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{ textAlign: "center", fontSize: 16, color: "white" }}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={{
            backgroundColor: "#007AFF",
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 16, color: "white" }}>
            Edit Company Profile
          </Text>
        </TouchableOpacity>
      )}

      <Button title="Logout" onPress={signOut} color="#FF3B30" />
    </ScrollView>
  );
}
