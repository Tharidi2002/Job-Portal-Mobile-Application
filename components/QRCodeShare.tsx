import React from "react";
import { View, Text, TouchableOpacity, Alert, Share } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface QRCodeShareProps {
  data: string;
  title?: string;
}

export default function QRCodeShare({
  data,
  title = "Share",
}: QRCodeShareProps) {
  const { colors } = useTheme();

  const handleShare = async () => {
    try {
      await Share.share({
        message: data,
        title: title,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share");
      console.error(error);
    }
  };

  const handleCopy = () => {
    // For now, just show the data in an alert
    // You can integrate with clipboard later if needed
    Alert.alert("QR Code Data", data, [
      {
        text: "Share",
        onPress: handleShare,
      },
      {
        text: "OK",
        style: "cancel",
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleCopy}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <MaterialIcons name="qr-code" size={24} color={colors.primary} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: colors.text, fontWeight: "600" }}>{title}</Text>
        <Text
          style={{ color: colors.textSecondary, fontSize: 12 }}
          numberOfLines={1}
        >
          {data}
        </Text>
      </View>
      <MaterialIcons name="share" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}
