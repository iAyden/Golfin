import React from "react";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import GolfLogin from "@/components/UserComponents/GolfLogin";

export default function login() {
  const [fontsLoaded] = useFonts({
    gharison: require("../assets/fonts/gharison.ttf"),
  });
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <GolfLogin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
