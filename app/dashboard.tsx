import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { getJobs, Job } from "../services/jobService";
import { getAllCompanies, UserProfile } from "../services/userService";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function DashboardScreen() {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [companies, setCompanies] = useState<UserProfile[]>([]);
	const [loading, setLoading] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);
	const router = useRouter();
	const { width } = Dimensions.get('window');

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const jobsData = await getJobs();
				const companiesData = await getAllCompanies();
				setJobs(jobsData);
				setCompanies(companiesData);
			} catch (error) {
				setJobs([]);
				setCompanies([]);
			}
			setLoading(false);
		};
		fetchData();
	}, []);

	const getCompany = (companyId: string) =>
		companies.find((c) => c.uid === companyId);

	return (
		<View style={{ flex: 1 }}>
			{/* Top Bar with Burger Menu */}
			<View style={styles.topBar}>
				<TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.burgerButton}>
					<MaterialIcons name="menu" size={32} color="#222" />
				</TouchableOpacity>
				<Text style={styles.title}>Dashboard</Text>
			</View>
			{/* Dropdown Menu Overlay */}
			{menuOpen && (
				<TouchableOpacity
					style={styles.menuOverlay}
					activeOpacity={1}
					onPress={() => setMenuOpen(false)}
				>
					<View style={[styles.menuBox, { width: width - 32 }]}> 
						<Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8, marginLeft: 8 }}>Navigation</Text>
						<TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/about"); }}>
							<MaterialIcons name="info" size={20} color="#222" />
							<Text style={styles.menuText}>About</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/dashboard"); }}>
							<MaterialIcons name="dashboard" size={20} color="#222" />
							<Text style={styles.menuText}>Dashboard</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); router.push("/(auth)/login"); }}>
							<MaterialIcons name="login" size={20} color="#222" />
							<Text style={styles.menuText}>Login</Text>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			)}
			<ScrollView style={styles.container}>
				<Text style={styles.header}>Registered Companies</Text>
				{loading ? (
					<ActivityIndicator size="large" style={{ marginVertical: 20 }} />
				) : companies.length === 0 ? (
					<Text style={styles.emptyText}>No companies found.</Text>
				) : (
					companies.map((company) => (
						<View key={company.uid} style={styles.card}>
							{company.logo && (
								<Image source={{ uri: company.logo }} style={styles.logo} />
							)}
							<Text style={styles.title}>{company.companyName}</Text>
							<Text style={styles.subtitle}>{company.location}</Text>
							<Text style={styles.description}>{company.description}</Text>
						</View>
					))
				)}

				<Text style={styles.header}>Job Postings</Text>
				{loading ? (
					<ActivityIndicator size="large" style={{ marginVertical: 20 }} />
				) : jobs.length === 0 ? (
					<Text style={styles.emptyText}>No job postings found.</Text>
				) : (
					jobs.map((job) => {
						const company = getCompany(job.companyId);
						return (
							<View key={job.id} style={styles.card}>
								{company?.logo && (
									<Image source={{ uri: company.logo }} style={styles.logo} />
								)}
								<Text style={styles.title}>{job.title}</Text>
								<Text style={styles.subtitle}>{company?.companyName || job.companyId} • {job.location}</Text>
								<Text style={styles.description}>{job.description}</Text>
								{job.salary && (
									<Text style={styles.salary}>Salary: {job.salary}</Text>
								)}
							</View>
						);
					})
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f9f9f9",
		paddingHorizontal: 12,
		paddingTop: 24,
	},
	topBar: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 40,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		backgroundColor: "#f9f9f9",
		zIndex: 2,
	},
	burgerButton: {
		marginRight: 16,
	},
	menuOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.08)',
		zIndex: 20,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	menuBox: {
		marginTop: 70,
		backgroundColor: "#fff",
		borderRadius: 12,
		elevation: 6,
		shadowColor: "#000",
		shadowOpacity: 0.13,
		shadowRadius: 12,
		paddingVertical: 8,
		zIndex: 30,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		paddingHorizontal: 20,
	},
	menuText: {
		marginLeft: 12,
		fontSize: 16,
		color: "#222",
	},
	header: {
		fontSize: 22,
		fontWeight: "bold",
		marginTop: 16,
		marginBottom: 8,
		color: "#222",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 2,
	},
	logo: {
		width: 48,
		height: 48,
		borderRadius: 24,
		marginBottom: 10,
		backgroundColor: "#e0e7ff",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#222",
	},
	subtitle: {
		fontSize: 15,
		color: "#555",
		marginTop: 2,
		marginBottom: 6,
	},
	description: {
		fontSize: 14,
		color: "#444",
		marginBottom: 6,
	},
	salary: {
		fontSize: 15,
		color: "#3730a3",
		fontWeight: "bold",
		marginTop: 4,
	},
	emptyText: {
		color: "#888",
		fontSize: 16,
		marginVertical: 20,
		textAlign: "center",
	},
});
