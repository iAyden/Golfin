import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import GolfLogin from "@/components/UserComponents/GolfLogin";

export default function login() {
  return (
    <ImageBackground
      source={require("../assets/images/BG IMG GLF.png")}
      style={styles.imageBg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <GolfLogin />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f5f5f5",
  },
  imageBg: {
    flex: 1,
    // width: "100%",
    // height: "100%",
  },
});
