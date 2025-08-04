import React, { useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import Leaderboard from "@/components/UserComponents/LeaderBoard";

const LeaderBoardScreen = () => {
  return (
    <ImageBackground
      source={require("../assets/images/BG IMG GLF.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View>
        <Leaderboard />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default LeaderBoardScreen;
