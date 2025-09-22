import React from "react";
import { Stack } from "expo-router";

const CompaniesLayout = () => {
  return (
    <Stack screenOptions={{ animation: "fade_from_bottom" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Company Details" }} />
    </Stack>
  );
};

export default CompaniesLayout;
