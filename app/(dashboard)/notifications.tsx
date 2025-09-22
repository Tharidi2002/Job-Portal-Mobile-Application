import React from "react";
import { View, Text } from "react-native";

export default function NotificationsScreen() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" }}>
			<Text style={{ fontSize: 28, fontWeight: "bold", color: "#222" }}>Notifications</Text>
			<Text style={{ color: "#666", marginTop: 8, fontSize: 16 }}>Your job alerts and notifications will appear here.</Text>
		</View>
	);
}
