import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  Animated,
  Easing,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Sidebar from "@/components/Structures/Sidebar";
// import { Text } from '@/components/Themed';
import ImagenSinFondo from "@/components/VisualComponents/ImagenSinFondo";

const App: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState("home");
  const sidebarWidth = useRef(new Animated.Value(250)).current;
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 700;
  const [activeCard, setActiveCard] = useState<
    "profile" | "history" | "friends"
  >("profile");

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

  // Responsive styles for cards, rowCards, and tabs
  const dynamicStyles = StyleSheet.create({
    rowCards: {
      flexDirection: width < 700 ? "column" : "row",
      justifyContent: width < 700 ? "flex-start" : "center",
      alignItems: width < 700 ? "stretch" : "flex-start",
      gap: width < 500 ? 8 : 16,
      width: "100%",
    },
    card: {
      backgroundColor: "rgb(99, 150, 57)",
      borderRadius: 16,
      marginBottom: width < 500 ? 12 : 20,
      padding: width < 400 ? 10 : 16,
      width: width < 700 ? "100%" : width < 1000 ? 220 : 300,
      alignSelf: width < 700 ? "stretch" : "auto",
      minWidth: 0,
      maxWidth: width < 700 ? "100%" : 500,
    },
    tabButtonsRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: width < 500 ? 8 : 16,
      gap: width < 500 ? 4 : 12,
      flexWrap: width < 400 ? "wrap" : "nowrap",
    },
    tabButton: {
      paddingVertical: width < 400 ? 6 : 8,
      paddingHorizontal: width < 400 ? 12 : 24,
      borderRadius: 20,
      backgroundColor: "rgba(99,150,57,0.7)",
      marginHorizontal: 2,
      marginBottom: width < 400 ? 4 : 0,
    },
    tabButtonActive: {
      backgroundColor: "#fad21e",
    },
    tabButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: width < 400 ? 13 : 16,
    },
  });

  return (
    <ImageBackground
      source={require("../assets/images/BG IMG GLF.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: "rgba(255, 255, 255, 0)",
            flex: 1,
            minHeight: "100%",
          },
        ]}
      >
        <Sidebar
          isVisible={sidebarVisible}
          width={sidebarWidth}
          onMenuItemPress={handleMenuPress}
          activeMenuItem={activeMenu}
        />
        <Pressable
          style={styles.hamburgerButton}
          onPress={() => setSidebarVisible(!sidebarVisible)}
          accessibilityLabel="Toggle Sidebar"
        >
          <FontAwesome name="bars" size={24} color="#2f855a" />
        </Pressable>

        <View
          style={[
            styles.mainContentWrapper,
            { marginTop: isSmallScreen ? 48 : 0, flex: 1, minHeight: "100%" },
          ]}
        >
          {/* Engulf main content for sidebar layout */}
          {isSmallScreen ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <View style={dynamicStyles.tabButtonsRow}>
                <TouchableOpacity
                  style={[
                    dynamicStyles.tabButton,
                    activeCard === "profile"
                      ? dynamicStyles.tabButtonActive
                      : null,
                  ]}
                  onPress={() => setActiveCard("profile")}
                >
                  <Text style={dynamicStyles.tabButtonText}>Profile Stats</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    dynamicStyles.tabButton,
                    activeCard === "history"
                      ? dynamicStyles.tabButtonActive
                      : null,
                  ]}
                  onPress={() => setActiveCard("history")}
                >
                  <Text style={dynamicStyles.tabButtonText}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    dynamicStyles.tabButton,
                    activeCard === "friends"
                      ? dynamicStyles.tabButtonActive
                      : null,
                  ]}
                  onPress={() => setActiveCard("friends")}
                >
                  <Text style={dynamicStyles.tabButtonText}>Friends</Text>
                </TouchableOpacity>
              </View>
              {activeCard === "profile" && (
                <View style={dynamicStyles.card}>
                  {/* Profile Card */}
                  <View style={styles.profileSection}>
                    <Image
                      source={{
                        uri: "https://i.pinimg.com/236x/36/b9/9d/36b99dd44debc8614db0c7445ac57b3b.jpg",
                      }}
                      style={styles.profileImg}
                    />
                    <Text style={styles.cardTitle}>Juanito el mas capito</Text>
                    <Text style={styles.badgeGreen}>pro en frifayer</Text>
                    <Text style={styles.gamerTag}>ejemplo@gmail.com</Text>
                    <View style={styles.socialIcons}>
                      <FontAwesome
                        name="edit"
                        size={24}
                        color="#069809"
                        style={styles.socialIcon}
                      />
                      <FontAwesome
                        name="sign-out"
                        size={24}
                        color="#069809"
                        style={styles.socialIcon}
                      />
                    </View>
                  </View>
                  <View style={styles.divider} />
                  {/* Game Stats */}
                  <View style={styles.gameStats}>
                    <View style={styles.gameItem}>
                      <View style={styles.gameIcon}>
                        <FontAwesome name="flag" size={24} color="#069809" />
                      </View>
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>Hole in one</Text>
                        <Text style={styles.gameDetail}>
                          Range: challenguer lol
                        </Text>
                      </View>
                    </View>
                    <View style={styles.gameItem}>
                      <View style={styles.gameIcon}>
                        <FontAwesome name="clock-o" size={24} color="#069809" />
                      </View>
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>Scoring time</Text>
                        <Text style={styles.gameDetail}>Range: PLATA</Text>
                      </View>
                    </View>
                    <View style={styles.gameItem}>
                      <View style={styles.gameIcon}>
                        <FontAwesome
                          name="heartbeat"
                          size={24}
                          color="#069809"
                        />
                      </View>
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>Hole interrupted</Text>
                        <Text style={styles.gameDetail}>Range: PLATINITO</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              {activeCard === "history" && (
                <View style={dynamicStyles.card}>
                  {/* History Card */}
                  <Text style={styles.cardTitle}>History</Text>
                  {/* Last Game Played Section */}
                  <View style={styles.lastGameSection}>
                    <Text style={styles.lastGameTitle}>Last Game Played</Text>
                    <Text style={styles.lastGameDetail}>
                      "Golf Masters 2025"
                    </Text>
                    <Text style={styles.lastGameSubDetail}>
                      Date: 2025-06-01
                    </Text>
                    <Text style={styles.lastGameSubDetail}>Score: 72 (-1)</Text>
                    <Text style={styles.lastGameSubDetail}>
                      Traps Activated: 3
                    </Text>
                    <Text style={styles.lastGameSubDetail}>
                      Birdies: 5 | Pars: 10 | Bogeys: 3
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: "https://media.tacdn.com/media/attractions-splice-spp-674x446/07/b3/5b/3a.jpg",
                    }}
                    style={styles.imgTemporada}
                  />
                  {/* Example progress bar (static) */}
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="crosshairs" size={16} /> Total hoyos
                      anotados: 87%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "87%" }]} />
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="tachometer" size={16} /> Rendimiento:
                      320%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "80%" }]} />
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="users" size={16} /> Tiros por partida:
                      95%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "95%" }]} />
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="user" size={16} /> Friends: 89%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "89%" }]} />
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>Golf Achievements</Text>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="trophy"
                      size={24}
                      color="#FFD700"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>El mas mejor</Text>
                      <Text>
                        Primer puesto - Torneo internacional de BEYBLADE
                      </Text>
                    </View>
                  </View>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="star"
                      size={24}
                      color="#C0C0C0"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>
                        MOLESTADOR DE PERSONAS
                      </Text>
                      <Text>ME LA PARTIEROn</Text>
                    </View>
                  </View>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="trophy"
                      size={24}
                      color="#CD7F32"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>Holes record</Text>
                      <Text>45 hoyos seguidos</Text>
                    </View>
                  </View>
                </View>
              )}
              {activeCard === "friends" && (
                <View style={dynamicStyles.card}>
                  {/* Friends Card (simplified) */}
                  <Text style={styles.cardTitle}>TABLE DE AMIGOS</Text>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="envelope"
                      size={24}
                      color="#069809"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>AMIGO</Text>
                      <Text>AMIGO</Text>
                    </View>
                  </View>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="phone"
                      size={24}
                      color="#069809"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>AMIGO</Text>
                      <Text>AMIGO</Text>
                    </View>
                  </View>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="calendar"
                      size={24}
                      color="#069809"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>AMIGO</Text>
                      <Text>AMIGO</Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          ) : (
            <ScrollView
              contentContainerStyle={styles.mainContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
            >
              <View style={dynamicStyles.rowCards}>
                {/* Profile Card */}
                <View style={dynamicStyles.card}>
                  <View style={styles.profileSection}>
                    <Image
                      source={{
                        uri: "https://i.pinimg.com/236x/36/b9/9d/36b99dd44debc8614db0c7445ac57b3b.jpg",
                      }}
                      style={styles.profileImg}
                    />
                    <Text style={styles.cardTitle}>Juanito el mas capito</Text>
                    <Text style={styles.badgeGreen}>pro en frifayer</Text>
                    <Text style={styles.gamerTag}>ejemplo@gmail.com</Text>
                    <View style={styles.socialIcons}>
                      <FontAwesome
                        name="edit"
                        size={24}
                        color="#069809"
                        style={styles.socialIcon}
                      />
                      <FontAwesome
                        name="sign-out"
                        size={24}
                        color="#069809"
                        style={styles.socialIcon}
                      />
                    </View>
                  </View>
                  <View style={styles.divider} />
                  {/* Game Stats */}
                  <View style={styles.gameStats}>
                    <View style={styles.gameItem}>
                      <View style={styles.gameIcon}>
                        <FontAwesome name="flag" size={24} color="#069809" />
                      </View>
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>Hole in one</Text>
                        <Text style={styles.gameDetail}>
                          Range: challenguer lol
                        </Text>
                      </View>
                    </View>
                    <View style={styles.gameItem}>
                      <View style={styles.gameIcon}>
                        <FontAwesome name="clock-o" size={24} color="#069809" />
                      </View>
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>Scoring time</Text>
                        <Text style={styles.gameDetail}>Range: PLATA</Text>
                      </View>
                    </View>
                    <View style={styles.gameItem}>
                      <View style={styles.gameIcon}>
                        <FontAwesome
                          name="heartbeat"
                          size={24}
                          color="#069809"
                        />
                      </View>
                      <View style={styles.gameInfo}>
                        <Text style={styles.gameName}>Hole interrupted</Text>
                        <Text style={styles.gameDetail}>Range: PLATINITO</Text>
                      </View>
                    </View>
                  </View>
                </View>
                {/* History Card */}
                <View style={dynamicStyles.card}>
                  <Text style={styles.cardTitle}>History</Text>
                  {/* Last Game Played Section */}
                  <View style={styles.lastGameSection}>
                    <Text style={styles.lastGameTitle}>Last Game Played</Text>
                    <Text style={styles.lastGameDetail}>
                      "Golf Masters 2025"
                    </Text>
                    <Text style={styles.lastGameSubDetail}>
                      Date: 2025-06-01
                    </Text>
                    <Text style={styles.lastGameSubDetail}>Score: 72 (-1)</Text>
                    <Text style={styles.lastGameSubDetail}>
                      Traps Activated: 3
                    </Text>
                    <Text style={styles.lastGameSubDetail}>
                      Birdies: 5 | Pars: 10 | Bogeys: 3
                    </Text>
                  </View>
                  <Image
                    source={{
                      uri: "https://media.tacdn.com/media/attractions-splice-spp-674x446/07/b3/5b/3a.jpg",
                    }}
                    style={styles.imgTemporada}
                  />
                  {/* Example progress bar (static) */}
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="crosshairs" size={16} /> Total hoyos
                      anotados: 87%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "87%" }]} />
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="tachometer" size={16} /> Rendimiento:
                      320%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "80%" }]} />
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="users" size={16} /> Tiros por partida:
                      95%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "95%" }]} />
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="user" size={16} /> Friends: 89%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "89%" }]} />
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>Golf Achievements</Text>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="trophy"
                      size={24}
                      color="#FFD700"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>El mas mejor</Text>
                      <Text>
                        Primer puesto - Torneo internacional de BEYBLADE
                      </Text>
                    </View>
                  </View>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="star"
                      size={24}
                      color="#C0C0C0"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>
                        MOLESTADOR DE PERSONAS
                      </Text>
                      <Text>ME LA PARTIEROn</Text>
                    </View>
                  </View>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="trophy"
                      size={24}
                      color="#CD7F32"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>Holes record</Text>
                      <Text>45 hoyos seguidos</Text>
                    </View>
                  </View>
                </View>
                {/* Friends Card (simplified) */}
                <View style={dynamicStyles.card}>
                  <Text style={styles.cardTitle}>TABLE DE AMIGOS</Text>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="envelope"
                      size={24}
                      color="#069809"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>AMIGO</Text>
                      <Text>AMIGO</Text>
                    </View>
                  </View>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="phone"
                      size={24}
                      color="#069809"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>AMIGO</Text>
                      <Text>AMIGO</Text>
                    </View>
                  </View>
                  <View style={styles.achievementItem}>
                    <FontAwesome
                      name="calendar"
                      size={24}
                      color="#069809"
                      style={styles.achievementIcon}
                    />
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementTitle}>AMIGO</Text>
                      <Text>AMIGO</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </ImageBackground>
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
  mainContentWrapper: {
    flex: 1,
    flexDirection: "column",
    zIndex: 0,
  },
  hamburgerButton: {
    margin: 15,
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
  rowCards: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 16,
    width: "100%",
  },
  card: {
    backgroundColor: "rgb(99, 150, 57)",
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    width: "100%",
    alignSelf: "stretch",
    minWidth: 0,
    maxWidth: 500,
  },
  profileSection: { alignItems: "center", marginBottom: 10 },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: "#fff",
    marginBottom: 10,
  },
  cardTitle: {
    color: "rgb(246, 239, 193)",
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 4,
  },
  badgeGreen: {
    backgroundColor: "#107C10",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 8,
    textAlign: "center",
  },
  gamerTag: {
    color: "rgb(246, 239, 193)",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 8,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 8,
  },
  socialIcon: { marginHorizontal: 6 },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
    width: "85%",
    alignSelf: "center",
  },
  gameStats: { width: "100%" },
  gameItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(232,245,233,0.3)",
    padding: 10,
    borderRadius: 10,
  },
  gameIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  gameInfo: { flex: 1 },
  gameName: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
    fontSize: 16,
  },
  gameDetail: { fontSize: 13, color: "#78909c", marginBottom: 2 },
  progressContainer: { marginTop: 8 },
  progressLabel: { fontSize: 13, color: "#fff", marginBottom: 2 },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: { height: 8, borderRadius: 4, backgroundColor: "#107C10" },
  sectionTitle: {
    color: "#fad21e",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(232,245,233,0.3)",
  },
  achievementIcon: { marginRight: 12 },
  achievementText: { flex: 1 },
  achievementTitle: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  imgTemporada: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  historySection: {
    marginTop: 12,
    marginBottom: 12,
  },
  historyTitle: {
    color: "#fad21e",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  historyDetail: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
  lastGameSection: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  lastGameTitle: {
    color: "#fad21e",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  lastGameDetail: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  lastGameSubDetail: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 1,
  },
  tabButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 12,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: "rgba(99,150,57,0.7)",
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: "#fad21e",
  },
  tabButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default App;
