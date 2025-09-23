import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useAuth } from '../../../../context/AuthContext';
import { createJob } from '../../../../services/jobService';
import BurgerMenu from '../../../../components/BurgerMenu';
import { useTheme } from '../../../../context/ThemeContext';

export default function NewJobScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const [job, setJob] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
  });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post a job.');
      return;
    }

    if (!job.title || !job.location) {
      Alert.alert('Error', 'Title and location are required.');
      return;
    }

    setSaving(true);
    try {
      await createJob({ ...job, companyId: user.uid });
      Alert.alert('Success', 'Your job has been posted.', [
        { text: 'OK', onPress: () => router.push('/(dashboard)/home') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to post your job.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <BurgerMenu title="Post a New Job" />
      <ScrollView style={styles.container}>
        <Text style={[styles.label, { color: colors.text }]}>Job Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={job.title}
          onChangeText={(text) => setJob({ ...job, title: text })}
          placeholder="e.g., Software Engineer"
          placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={job.location}
          onChangeText={(text) => setJob({ ...job, location: text })}
          placeholder="e.g., San Francisco, CA"
          placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Salary</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={job.salary}
          onChangeText={(text) => setJob({ ...job, salary: text })}
          placeholder="e.g., $120,000 per year"
          placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Job Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={job.description}
          onChangeText={(text) => setJob({ ...job, description: text })}
          placeholder="Describe the job responsibilities, requirements, etc."
          multiline
          placeholderTextColor={colors.text}
        />

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: saving ? colors.primary : colors.primary }]} 
          onPress={handleCreate} 
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Post Job</Text>
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
    minHeight: 120,
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
