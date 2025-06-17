import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Text,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Sidebar from "@/components/Structures/Sidebar";
// import { Text } from '@/components/Themed';
import ImagenSinFondo from "@/components/VisualComponents/ImagenSinFondo";

const App: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState("home");
  const sidebarWidth = useRef(new Animated.Value(250)).current;

  useEffect(() => {
    Animated.timing(sidebarWidth, {
      toValue: sidebarVisible ? 250 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [sidebarVisible]);

  const handleMenuPress = (menuItem: string) => {
    setActiveMenu(menuItem);
  };

  return (
    <ImageBackground
      source={require("../assets/images/BG IMG GLF.png")}
      style={styles.imageBg}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Sidebar
          isVisible={sidebarVisible}
          width={sidebarWidth}
          onMenuItemPress={handleMenuPress}
          activeMenuItem={activeMenu}
        />

        <View style={styles.mainContent}>
          <Pressable
            style={styles.hamburgerButton}
            onPress={() => setSidebarVisible(!sidebarVisible)}
            accessibilityLabel="Toggle Sidebar"
          >
            <FontAwesome name="bars" size={24} color="#2f855a" />
          </Pressable>

          <View style={styles.cardsRow}>
            {[
              {
                title: "Golf Course",
                image: require("../assets/images/golf.png"),
                description:
                  "Play on the best golf courses and challenge your friends!",
                route: "/createLobby",
              },
              {
                title: "Golf Course",
                image: require("../assets/images/golf.png"),
                description:
                  "Play on the best golf courses and challenge your friends!",
                route: "/createLobby",
              },
              {
                title: "Golf Course",
                image: require("../assets/images/golf.png"),
                description:
                  "Play on the best golf courses and challenge your friends!",
                route: "/createLobby",
              },
            ].map((card, idx) => (
              <Pressable
                key={card.title}
                style={styles.card}
                onPress={() => {
                  // Use navigation or router if available, fallback to window.location
                  if (typeof window !== "undefined" && window.location) {
                    window.location.href = card.route;
                  }
                }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardImageWrapper}>
                    <ImagenSinFondo
                      source={card.image}
                      width={80}
                      height={80}
                    />
                  </View>
                  <View style={styles.cardTextWrapper}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardDescription}>
                      {card.description}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    // backgroundColor: "#f0fff4",
  },
  imageBg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  mainContent: {
    flex: 1,
    padding: 20,
    zIndex: 0,
  },
  hamburgerButton: {
    marginBottom: 20,
  },
  ejemplo: {
    backgroundColor: "#FFF",
    width: 100,
    height: 100,
  },

  imgGameContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    margin: 100,
  },
  cardsContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  cardsRow: {
    width: "100%",
    flexDirection: "column",
    gap: 24,
    marginTop: 32,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  cardImageWrapper: {
    marginRight: 20,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2f855a",
  },
  cardDescription: {
    fontSize: 15,
    color: "#444",
  },
});

export default App;
