import React, { useEffect, useState, useCallback } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../../context/AuthContext';
import { getJobById, updateJob, deleteJob, Job } from '../../../../services/jobService';
import BurgerMenu from '../../../../components/BurgerMenu';
import { useTheme } from '../../../../context/ThemeContext';

export default function EditJobScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const [job, setJob] = useState<Partial<Job>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchJob = useCallback(async () => {
    if (typeof id !== 'string') return;

    setLoading(true);
    try {
      const jobData = await getJobById(id);
      if (jobData && jobData.companyId === user?.uid) {
        setJob(jobData);
      } else {
        Alert.alert('Error', 'Job not found or you don\'t have permission to edit it.');
        router.back();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load the job details.');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleUpdate = async () => {
    if (!job.id) return;

    setSaving(true);
    try {
      await updateJob(job.id, job);
      Alert.alert('Success', 'Job has been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update the job.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!job.id) return;

    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteJob(job.id!);
              Alert.alert('Deleted', 'Job post has been deleted.', [
                { text: 'OK', onPress: () => router.push('/(dashboard)/home') },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the job.');
              setDeleting(false);
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <BurgerMenu title="Loading..." />
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <BurgerMenu title="Edit Job" />
      <ScrollView style={styles.container}>
        <Text style={[styles.label, { color: colors.text }]}>Job Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={job.title || ''}
          onChangeText={(text) => setJob({ ...job, title: text })}
          placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={job.location || ''}
          onChangeText={(text) => setJob({ ...job, location: text })}
           placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Salary</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={job.salary || ''}
          onChangeText={(text) => setJob({ ...job, salary: text })}
           placeholderTextColor={colors.text}
        />

        <Text style={[styles.label, { color: colors.text }]}>Job Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={job.description || ''}
          onChangeText={(text) => setJob({ ...job, description: text })}
          multiline
           placeholderTextColor={colors.text}
        />

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: saving ? colors.primary : colors.primary }]} 
          onPress={handleUpdate} 
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Save Changes</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.deleteButton, { borderColor: deleting ? '#a0a0a0' : '#d9534f' }]} 
          onPress={handleDelete} 
          disabled={deleting}
        >
          {deleting ? <ActivityIndicator color="#d9534f" /> : <Text style={[styles.buttonText, { color: '#d9534f' }]}>Delete Job</Text>}
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
