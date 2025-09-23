import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import "./../global.css";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { initializeServices } from "@/services/initService";
import Loader from "@/components/Loader";
import { useFonts } from "expo-font";
import { MaterialIcons } from "@expo/vector-icons";

const RootLayout = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    ...MaterialIcons.font,
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        const success = await initializeServices();
        setIsInitialized(success);
        if (!success) {
          // Only show this in development
          if (__DEV__) {
            Alert.alert(
              "Initialization Failed",
              "Some app services failed to initialize. This may cause certain features to not work properly."
            );
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (fontsLoaded) {
      initialize();
    }
  }, [fontsLoaded]);

  if (isLoading || !fontsLoaded) {
    return <Loader visible={true} />;
  }

  return (
    <ThemeProvider>
      <LoaderProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </LoaderProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
