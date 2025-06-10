import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Sidebar from "@/components/Structures/Sidebar";
// import { Text } from '@/components/Themed';
import ImagenSinFondo from "@/components/VisualComponents/ImagenSinFondo";

const App: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState("home"); // Cambiado a 'home'
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

        <View style={styles.imgGameContainer}>
          <Text style={styles.cardsContainer}>Tricky Valley</Text>
          <ImagenSinFondo
            source={require("../assets/images/favicon.png")}
            width={200}
            height={200}
            redirectTo="/createLobby"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f0fff4",
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
});

export default App;
