import React from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import UserCard from "@/components/Structures/GameCard"; // Adjust the path as needed

const App = () => {
  const [fontsLoaded] = useFonts({
    gharison: require("../assets/fonts/gharison.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      <UserCard />
    </View>
  );
};

export default App;
