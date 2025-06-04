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
      <Pressable
        style={styles.hamburgerButton}
        onPress={() => setSidebarVisible(!sidebarVisible)}
        accessibilityLabel="Toggle Sidebar"
      >
        <FontAwesome name="bars" size={24} color="#2f855a" />
      </Pressable>

      <View style={styles.mainContent}>
        <ScrollView contentContainerStyle={styles.mainContent}>
          <View style={styles.rowCards}>
            {/* Profile Card */}
            <View style={styles.card}>
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
                    <FontAwesome name="heartbeat" size={24} color="#069809" />
                  </View>
                  <View style={styles.gameInfo}>
                    <Text style={styles.gameName}>Hole interrupted</Text>
                    <Text style={styles.gameDetail}>Range: PLATINITO</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Stats Card */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Your stats</Text>
              <Image
                source={{
                  uri: "https://media.tacdn.com/media/attractions-splice-spp-674x446/07/b3/5b/3a.jpg",
                }}
                style={styles.imgTemporada}
              />
              {/* Example progress bar (static) */}
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>
                  <FontAwesome name="crosshairs" size={16} /> Total oyos
                  anotados: 87%
                </Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBar, { width: "87%" }]} />
                </View>
              </View>
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>
                  <FontAwesome name="tachometer" size={16} /> Rendimiento: 320%
                </Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBar, { width: "80%" }]} />
                </View>
              </View>
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>
                  <FontAwesome name="users" size={16} /> Tiros por partida: 95%
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
              <Text style={styles.sectionTitle}>Logros Destacados</Text>
              <View style={styles.achievementItem}>
                <FontAwesome
                  name="trophy"
                  size={24}
                  color="#FFD700"
                  style={styles.achievementIcon}
                />
                <View style={styles.achievementText}>
                  <Text style={styles.achievementTitle}>El mas mejor</Text>
                  <Text>Primer puesto - Torneo internacional de BEYBLADE</Text>
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
                  <Text>45 oyos seguidos</Text>
                </View>
              </View>
            </View>
            {/* Friends Card (simplified) */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>TABLE DE AMIGOS</Text>
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 16,
  },
  card: {
    backgroundColor: "rgba(10,70,12,0.6)",
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    width: 300, // Fixed width for cards
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
    color: "#107C10",
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 4,
  },
  badgeGreen: {
    backgroundColor: "#107C10",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
    textAlign: "center",
  },
  gamerTag: {
    color: "#78909c",
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
    color: "#107C10",
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
});

export default App;
