import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import Leaderboard from "@/components/UserComponents/LeaderBoard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LeaderboardStructure } from "@/components/UserComponents/LeaderBoard";
import Sidebar from "@/components/Structures/Sidebar";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";

const LeaderBoardScreen = () => {
  const [userData, setUserData] = useState([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardStructure[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState("LeaderBoard");
  const sidebarWidth = useRef(new Animated.Value(250)).current;

  const [fontsLoaded] = useFonts({
    gharison: require("../assets/fonts/gharison.ttf"),
  });

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const storedData = await AsyncStorage.getItem("latestUserCards");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        // handle error
      }
    };
    fetchUserCards();
  }, []);

  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: sidebarVisible ? 250 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [sidebarVisible]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/users/leaderboard")
      .then((res) => setLeaderboard(res.data))
      .catch((err) => {});
  }, []);

  const handleMenuItemPress = (menuItem: string) => {
    setActiveMenuItem(menuItem);
  };

  return (
    <ImageBackground
      source={require("../assets/images/BG IMG GLF.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.containerOuter}>
        <Sidebar
          isVisible={sidebarVisible}
          width={sidebarWidth}
          onMenuItemPress={handleMenuItemPress}
          activeMenuItem={activeMenuItem}
          style={styles.sidebarAbsolute}
        />

        <View style={styles.mainContent}>
          <Leaderboard data={leaderboard} />
        </View>

        <Pressable
          style={[styles.hamburgerButton, { left: sidebarVisible ? 200 : 0 }]}
          onPress={() => setSidebarVisible(!sidebarVisible)}
          accessibilityLabel="Toggle Sidebar"
        >
          <FontAwesome name="bars" size={28} color="#2E7D32" />
        </Pressable>
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
  containerOuter: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
  },
  sidebarAbsolute: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    maxWidth: 600,
    minWidth: 280,
    width: "100%",
    alignSelf: "center",
    marginLeft: 25,
  },
  hamburgerButton: {
    position: "absolute",
    top: 30,
    zIndex: 20,
    borderRadius: 20,
    padding: 6,
    elevation: 5,
  },
});

export default LeaderBoardScreen;
