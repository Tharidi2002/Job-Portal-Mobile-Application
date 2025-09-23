import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { createJob, getJobs, updateJob, deleteJob, Job } from '@/services/jobService';

export default function PostJobScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    if (user) {
      const userJobs = await getJobs(user.uid);
      setJobs(userJobs);
    }
  };

  const handleSaveJob = async () => {
    if (!title || !description || !location) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (editingJob) {
      // Update existing job
      const updatedJob = { ...editingJob, title, description, location };
      await updateJob(editingJob.id, updatedJob);
      setEditingJob(null);
    } else {
      // Create new job
      if(user){
        await createJob({ title, description, location, companyId: user.uid });
      }
    }

    // Reset form and reload jobs
    setTitle('');
    setDescription('');
    setLocation('');
    loadJobs();
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setTitle(job.title);
    setDescription(job.description);
    setLocation(job.location);
  };

  const handleDelete = async (jobId: string) => {
    await deleteJob(jobId);
    loadJobs();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{editingJob ? 'Edit Job' : 'Create Job'}</Text>

      <TextInput
        placeholder="Job Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
      />
      <TextInput
        placeholder="Job Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
        multiline
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
      />
      <Button title={editingJob ? 'Update Job' : 'Post Job'} onPress={handleSaveJob} />
      {editingJob && <Button title="Cancel Edit" onPress={() => setEditingJob(null)} />}

      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Your Job Postings</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={{ fontStyle: 'italic' }}>{item.location}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              <Button title="Edit" onPress={() => handleEdit(item)} />
              <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}
