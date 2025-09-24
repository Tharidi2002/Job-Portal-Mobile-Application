
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions, TouchableOpacity } from "react-native";

const AboutScreen = () => {
	const router = useRouter();
	const [menuOpen, setMenuOpen] = React.useState(false);
	const { width } = Dimensions.get('window');
	 return (
		 <View style={styles.container}>
			 {/* Top Bar with Burger Menu */}
			 <View style={styles.topBar}>
				 <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.burgerButton}>
					 <MaterialIcons name="menu" size={32} color="#222" />
				 </TouchableOpacity>
				 <Text style={styles.title}>About</Text>
			 </View>
			 {/* Dropdown Menu Overlay */}
			 {menuOpen && (
				 <TouchableOpacity
					 style={styles.menuOverlay}
					 activeOpacity={1}
					 onPress={() => setMenuOpen(false)}
				 >
					 <View style={styles.menuBox}>
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
			 <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
				 <Text style={styles.title}>About JobGrid</Text>
				 <Text style={styles.subtitle}>Your Professional Job Posting Platform</Text>
				 <Text style={styles.paragraph}>
					 JobGrid is a modern job posting and recruitment platform designed to connect top companies with talented job seekers. Our mission is to make job discovery and hiring simple, transparent, and effective for everyone.
				 </Text>
				 <Text style={styles.sectionTitle}>Key Features</Text>
				 <Text style={styles.paragraph}>
					 • Browse and search job postings from leading companies
					 {'\n'}• Register your company and post job vacancies easily
					 {'\n'}• Manage your company profile and job listings
					 {'\n'}• Apply for jobs and track your applications
					 {'\n'}• Secure, user-friendly, and mobile-optimized experience
				 </Text>
				 <Text style={styles.sectionTitle}>Contact & Support</Text>
				 <Text style={styles.paragraph}>
					 For support or inquiries, please contact us at:
					 {'\n'}Email: support@jobgrid.com
					 {'\n'}Phone: +1 (800) 123-4567
				 </Text>
				 <Text style={styles.footer}>© {new Date().getFullYear()} JobGrid. All rights reserved.</Text>
			 </ScrollView>
		 </View>
	 );
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#f9fafb" },
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
	title: { fontSize: 28, fontWeight: "bold", color: "#22223b", marginBottom: 8 },
	subtitle: { fontSize: 18, color: "#4a4e69", marginBottom: 18 },
	paragraph: { fontSize: 15, color: "#22223b", marginBottom: 16, lineHeight: 22 },
	sectionTitle: { fontSize: 17, fontWeight: "600", color: "#22223b", marginTop: 10, marginBottom: 6 },
	footer: { fontSize: 13, color: "#9a8c98", marginTop: 32, textAlign: "center" },
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
		width: Dimensions.get('window').width - 32,
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
});
export default AboutScreen;
