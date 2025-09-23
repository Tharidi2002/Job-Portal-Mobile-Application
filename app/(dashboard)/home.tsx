import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    SafeAreaView, 
    TouchableOpacity, 
    ActivityIndicator, 
    RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { getJobsByCompany, Job } from '../../../services/jobService';
import BurgerMenu from '../../../components/BurgerMenu';
import { useTheme } from '../../../context/ThemeContext';

export default function DashboardHomeScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { colors } = useTheme();

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const userJobs = await getJobsByCompany(user.uid);
            setJobs(userJobs);
        } catch (e) {
            console.error("Failed to fetch user's jobs:", e);
            setError("Couldn't load your jobs. Please pull down to refresh.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchJobs().finally(() => setRefreshing(false));
    }, [fetchJobs]);

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" />
                    <Text style={{ marginTop: 10, color: colors.text }}>Loading your jobs...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centered}>
                    <Text style={{ color: 'red' }}>{error}</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.jobCard, { backgroundColor: colors.card }]} 
                        onPress={() => router.push(`/(dashboard)/jobs/${item.id}`)}
                    >
                        <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
                        <Text style={[styles.jobLocation, { color: colors.primary }]}>{item.location}</Text>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={
                    <TouchableOpacity 
                        style={[styles.postJobButton, { backgroundColor: colors.primary }]} 
                        onPress={() => router.push('/(dashboard)/jobs/new')}
                    >
                        <Text style={styles.postJobButtonText}>Post a New Job</Text>
                    </TouchableOpacity>
                }
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={{ color: colors.text, textAlign: 'center' }}>You haven't posted any jobs yet.</Text>
                    </View>
                }
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <BurgerMenu title="Dashboard" />
            {renderContent()}
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
        padding: 20,
    },
    jobCard: {
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    jobLocation: {
        fontSize: 14,
        marginTop: 4,
    },
    postJobButton: {
        margin: 16,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    postJobButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
