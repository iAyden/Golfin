import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Text,
  ImageBackground,
  Image,
  useWindowDimensions,
  Platform,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Sidebar from "@/components/Structures/Sidebar";
// import { Text } from '@/components/Themed';
import ImagenSinFondo from "@/components/VisualComponents/ImagenSinFondo";
import { checkAuthToken } from "@/utils/auth";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

// This makes the cards responsive and adapt to different screen sizes
const CARD_MIN_WIDTH = 260; // Lowered for small screens
const CARD_MAX_WIDTH = 480;
const CARD_IMAGE_RATIO = 0.28; // % of screen width for image size

type CardType = {
  title: string;
  image: any;
  description: string;
  route: string;
};

const cardData: CardType[] = [
  {
    title: "Mecha Madness",
    image: require("../assets/images/MiniCourse1.jpg"),
    description:
      "This course is designed for the best golf experience with friends!",
    route: "/createLobby",
  },
  {
    title: "Liberty Park",
    image: require("../assets/images/MiniCourse2.jpg"),
    description: "Try our new golf course with your friends and family!",
    route: "/createLobby",
  },
  {
    title: "School zone",
    image: require("../assets/images/MiniCourse3.jpg"),
    description: "This is the most challenging course we have, are you ready?",
    route: "/createLobby",
  },
];

const App: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState("home");
  const [layoutMode, setLayoutMode] = useState<
    "grid" | "linear" | "horizontal"
  >("linear"); // Default to linear
  const sidebarWidth = useRef(new Animated.Value(250)).current;
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    gharison: require("../assets/fonts/gharison.ttf"),
    // Add other fonts if needed
  });

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

  if (!fontsLoaded) return null;

  // Layout logic
  const isTablet = screenWidth >= 800;
  let numColumns = 1;
  if (layoutMode === "grid") numColumns = isTablet ? 2 : 1;
  if (layoutMode === "linear") numColumns = 1;
  // For horizontal, FlatList will be horizontal

  const horizontalPadding = 16;
  const totalHorizontalPadding = horizontalPadding * 2;
  const cardWidth =
    layoutMode === "horizontal"
      ? 320
      : Math.min(
          Math.max(
            (screenWidth - totalHorizontalPadding - (numColumns - 1) * 24) /
              numColumns,
            CARD_MIN_WIDTH
          ),
          Math.min(CARD_MAX_WIDTH, screenWidth - totalHorizontalPadding)
        );
  const cardImageSize = Math.floor(cardWidth * CARD_IMAGE_RATIO) + 80;

  const renderCard = ({ item }: ListRenderItemInfo<CardType>) => (
    <Pressable
      style={[
        styles.card,
        {
          width: layoutMode === "horizontal" ? 320 : cardWidth,
          minWidth: CARD_MIN_WIDTH,
          maxWidth: CARD_MAX_WIDTH,
        },
      ]}
      // This right here fixes an error when pressing the cards on mobile
      onPress={() => {
        // @ts-ignore
        navigation.navigate(item.route.replace("/", ""));
      }}
    >
      <View style={styles.cardContent}>
        <View
          style={[
            styles.cardImageWrapper,
            {
              width: cardImageSize,
              height: cardImageSize,
              borderRadius: 18,
            },
          ]}
        >
          <Image
            source={item.image}
            style={[styles.cardImage, { borderRadius: 18 }]}
          />
          <View style={styles.badge}>
            <FontAwesome name="star" size={14} color="#fff" />
          </View>
        </View>
        <View style={styles.cardTextWrapper}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ImageBackground
      source={require("../assets/images/BG IMG GLF.png")}
      style={styles.imageBg}
    >
      <View style={styles.container}>
        <Sidebar
          isVisible={sidebarVisible}
          width={sidebarWidth}
          onMenuItemPress={handleMenuPress}
          activeMenuItem={activeMenu}
          style={styles.sidebarAbsolute}
        />
        <Pressable
          style={[styles.hamburgerButton, { left: sidebarVisible ? 200 : 0 }]}
          onPress={() => setSidebarVisible(!sidebarVisible)}
          accessibilityLabel="Toggle Sidebar"
        >
          <FontAwesome name="bars" size={28} color="#2f855a" />
        </Pressable>

        <View style={styles.mainContent}>
          <FlatList
            key={`layout-${layoutMode}-${numColumns}`}
            data={cardData}
            renderItem={renderCard}
            keyExtractor={(item, idx) => item.title + idx}
            numColumns={layoutMode === "horizontal" ? 1 : numColumns}
            horizontal={layoutMode === "horizontal"}
            columnWrapperStyle={
              layoutMode === "grid" && numColumns > 1
                ? { justifyContent: "space-between", gap: 24, marginBottom: 0 }
                : undefined
            }
            contentContainerStyle={{
              gap: 24,
              paddingBottom: 40,
              paddingHorizontal: horizontalPadding,
              alignItems: "center",
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
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
    padding: 20,
    zIndex: 0,
    marginLeft: 25, //This right here is the key to have the maincontent not clip into the sidebar
  },
  hamburgerButton: {
    position: "absolute",
    top: 30,
    zIndex: 20,
    borderRadius: 20,
    padding: 6,
    elevation: 5,
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
  card: {
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
    marginBottom: 0,
    marginHorizontal: 0,
    flex: 1,
    minHeight: 120,
  },
  cardsContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 0,
  },
  cardImageWrapper: {
    marginRight: 20,
    borderWidth: 3,
    borderColor: "#2f855a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
    backgroundColor: "#fff",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: "#fad21e",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  polaroidCaption: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
    marginBottom: 2,
  },
  cardTextWrapper: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 8,
    paddingBottom: 8,
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
