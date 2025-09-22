import React from "react";
import { View, Text } from "react-native";

export default function PostScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Post a Job</Text>
      <Text style={{ marginTop: 8 }}>This is the Post screen. Add your job posting form here.</Text>
    </View>
  );
}
