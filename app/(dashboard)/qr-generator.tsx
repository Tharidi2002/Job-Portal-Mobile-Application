import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import * as Clipboard from "expo-clipboard";

export default function QRGeneratorScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [meal, setMeal] = useState({
    title: "Avocado Toast",
    name: "Avocado Toast with Egg",
    description:
      "Delicious and nutritious breakfast option with mashed avocado, poached egg, and whole grain toast.",
    mealType: "breakfast",
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tbsp olive oil",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)",
      "Fresh herbs (optional)",
    ].join(", "),
    cookingTime: "15",
    servings: "2",
    calories: "350",
  });

  // Generate QR code when meal data changes
  useEffect(() => {
    generateQRCode();
  }, [meal]);

  const generateQRCode = () => {
    try {
      // Format the meal data
      const mealData = {
        type: "recipe",
        meal: {
          title: meal.title,
          name: meal.name,
          description: meal.description,
          mealType: meal.mealType,
          ingredients: meal.ingredients.split(",").map((i) => i.trim()),
          cookingTime: parseInt(meal.cookingTime, 10),
          servings: parseInt(meal.servings, 10),
          calories: parseInt(meal.calories, 10),
          favorite: false,
        },
      };

      // Generate a URL for the QR code
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        JSON.stringify(mealData)
      )}`;
      setQrImageUrl(qrUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
      Alert.alert("Error", "Failed to generate QR code");
    }
  };

  const copyJsonToClipboard = async () => {
    try {
      // Format the meal data
      const mealData = {
        type: "recipe",
        meal: {
          title: meal.title,
          name: meal.name,
          description: meal.description,
          mealType: meal.mealType,
          ingredients: meal.ingredients.split(",").map((i) => i.trim()),
          cookingTime: parseInt(meal.cookingTime, 10),
          servings: parseInt(meal.servings, 10),
          calories: parseInt(meal.calories, 10),
          favorite: false,
        },
      };

      try {
        await Clipboard.setStringAsync(JSON.stringify(mealData, null, 2));
        Alert.alert("Success", "JSON data copied to clipboard");
      } catch (clipboardError) {
        // If clipboard API fails, show the JSON in an alert
        Alert.alert("Copy Data", "Copy this JSON data to use elsewhere:", [
          { text: "OK" },
        ]);
        console.log(JSON.stringify(mealData, null, 2));
      }
    } catch (error) {
      console.error("Error generating JSON data:", error);
      Alert.alert("Error", "Failed to generate JSON data");
    }
  };

  const openQRInBrowser = () => {
    if (qrImageUrl) {
      Linking.openURL(qrImageUrl);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "QR Code Generator",
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 16 }}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <MaterialIcons name="qr-code" size={32} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            Recipe QR Generator
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Create a QR code with recipe data
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.label, { color: colors.text }]}>
            Recipe Title
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={meal.title}
            onChangeText={(text) => setMeal({ ...meal, title: text })}
            placeholder="Recipe title"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Recipe Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={meal.name}
            onChangeText={(text) => setMeal({ ...meal, name: text })}
            placeholder="Recipe name"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={meal.description}
            onChangeText={(text) => setMeal({ ...meal, description: text })}
            placeholder="Recipe description"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />

          <Text style={[styles.label, { color: colors.text }]}>Meal Type</Text>
          <View style={styles.mealTypeContainer}>
            {["breakfast", "lunch", "dinner", "snack"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  {
                    backgroundColor:
                      meal.mealType === type
                        ? colors.primary
                        : colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setMeal({ ...meal, mealType: type })}
              >
                <Text
                  style={[
                    styles.mealTypeText,
                    { color: meal.mealType === type ? "#fff" : colors.text },
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>
            Ingredients (comma-separated)
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={meal.ingredients}
            onChangeText={(text) => setMeal({ ...meal, ingredients: text })}
            placeholder="Ingredients (separated by commas)"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: colors.text }]}>
                Cooking Time (min)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={meal.cookingTime}
                onChangeText={(text) => setMeal({ ...meal, cookingTime: text })}
                placeholder="Minutes"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: colors.text }]}>
                Servings
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                value={meal.servings}
                onChangeText={(text) => setMeal({ ...meal, servings: text })}
                placeholder="Servings"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Calories</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={meal.calories}
            onChangeText={(text) => setMeal({ ...meal, calories: text })}
            placeholder="Calories"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
          />
        </View>

        {qrImageUrl ? (
          <View
            style={[
              styles.qrContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.qrTitle, { color: colors.text }]}>
              Your Recipe QR Code
            </Text>
            <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
            <Text
              style={[styles.qrInstructions, { color: colors.textSecondary }]}
            >
              Scan this QR code in the Meal Mate app to import the recipe
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={openQRInBrowser}
              >
                <MaterialIcons name="open-in-new" size={20} color="#fff" />
                <Text style={styles.buttonText}>Open in Browser</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={copyJsonToClipboard}
              >
                <MaterialIcons name="content-copy" size={20} color="#fff" />
                <Text style={styles.buttonText}>Copy JSON</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.qrContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.qrTitle, { color: colors.text }]}>
              Generating QR code...
            </Text>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
  },
  mealTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  mealTypeButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minWidth: "22%",
    alignItems: "center",
  },
  mealTypeText: {
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfField: {
    width: "48%",
  },
  qrContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  qrImage: {
    width: 250,
    height: 250,
    marginVertical: 16,
    borderRadius: 8,
  },
  qrInstructions: {
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});
