import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { getUserProfile, updateUserProfile, UserProfile } from '../../../services/userService';
import BurgerMenu from '../../../components/BurgerMenu';
import { useTheme } from '../../../context/ThemeContext';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        setProfile({ uid: user.uid, email: user.email || '' });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load your profile.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, profile);
      Alert.alert('Success', 'Your profile has been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <BurgerMenu title="My Profile" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10, color: colors.text }}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <BurgerMenu title="My Profile" />
      <ScrollView style={styles.container}>
        <Text style={[styles.label, { color: colors.text }]}>Company Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={profile.companyName || ''}
          onChangeText={(text) => setProfile({ ...profile, companyName: text })}
          placeholder="Your Company Name"
          placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Industry</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={profile.companyIndustry || ''}
          onChangeText={(text) => setProfile({ ...profile, companyIndustry: text })}
          placeholder="e.g., Tech, Finance, etc."
          placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Company Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={profile.companyDescription || ''}
          onChangeText={(text) => setProfile({ ...profile, companyDescription: text })}
          placeholder="A brief description of your company."
          multiline
          placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Company Logo URL</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={profile.logo || ''}
          onChangeText={(text) => setProfile({ ...profile, logo: text })}
          placeholder="https://example.com/logo.png"
          autoCapitalize="none"
          placeholderTextColor={colors.text}
        />

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: saving ? colors.primary : colors.primary }]} 
          onPress={handleUpdate} 
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
