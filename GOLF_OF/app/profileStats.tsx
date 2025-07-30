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
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Sidebar from "@/components/Structures/Sidebar";
// import { Text } from '@/components/Themed';
import { useFonts } from "expo-font";
import { checkAuthToken } from "@/utils/auth";
import { getProfile } from "@/utils/api";
interface UserProfileDTO {
  id: string;
  username: string;
  email: string;
  photoUrl: string;
  role: string;
  gameHistory: any[];
  achievements: any[];
  friends: string[];
}

const App: React.FC = () => {
  // Load gharison font globally
  const [fontsLoaded] = useFonts({
    gharison: require("../assets/fonts/gharison.ttf"),
  });
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isCheckingAuth, setisCheckingAuth] = useState(true);
  const [profileData, setProfileData] = useState<UserProfileDTO | null>(null);
  const [activeMenu, setActiveMenu] = useState("home");
  const sidebarWidth = useRef(new Animated.Value(250)).current;
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 700;
  const [activeCard, setActiveCard] = useState<
    "profile" | "history" | "friends"
  >("profile");

  // --- Friends CRUD State FOR TEST USES ONLY DONT FREAK OUT ---
  const [friends, setFriends] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "Alice Birdie" },
    { id: "2", name: "Bob Eagle" },
    { id: "3", name: "Charlie Putter" },
    { id: "4", name: "Daisy Driver" },
    { id: "5", name: "Eddie Fairway" },
  ]);
  const [showAddFriendModal, setShowAddFriendModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    console.log("use efect");
    const verifyToken = async () => {
      const isLoggedIn = await checkAuthToken();
      console.log("isloggedin " + isLoggedIn);
      if (!isLoggedIn) {
        console.log("usuario no logeado");
        window.location.href = "/LogUser";
      } else {
        try {
          const data = await getProfile();
          console.log("data", data);
          setProfileData(data);
          setisCheckingAuth(false);
        } catch (error) {
          console.error("Error al obtener los datos del perfil", error);
        }
      }
    };
    verifyToken();
  }, []);

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

  // --- CRUD Handlers for Friends ---
  const handleAddFriend = (user: { id: string; name: string }) => {
    setFriends((prev) => [...prev, user]);
    setShowAddFriendModal(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleEditFriend = (friend: { id: string; name: string }) => {
    // Open edit modal or inline edit (to be implemented)
    // Example: setEditFriend(friend)
  };

  // --- Delete Friend Confirmation State ---
  const [friendToDelete, setFriendToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteFriend = (friend: { id: string; name: string }) => {
    setFriendToDelete(friend);
    setShowDeleteModal(true);
  };

  const confirmDeleteFriend = () => {
    if (friendToDelete) {
      setFriends((prev) => prev.filter((f) => f.id !== friendToDelete.id));
      setFriendToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const cancelDeleteFriend = () => {
    setFriendToDelete(null);
    setShowDeleteModal(false);
  };

  // For search, simulate API call TESTS!!!!
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    // Simulate search result
    setSearchResults(
      [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" },
      ].filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  // We got only one block of code and is truly responsive cuh
  const dynamicStyles = StyleSheet.create({
    rowCards: {
      flexDirection: width < 700 ? "column" : "row",
      justifyContent: width < 700 ? "flex-start" : "center",
      alignItems: width < 700 ? "stretch" : "flex-start",
      gap: width < 500 ? 8 : 16,
      width: "100%",
      padding: 24,
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

  // Here are the freakin' "tabs" for when the screen is small
  const folderTabStyles = StyleSheet.create({
    tabRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-end",
      height: 44,
      marginBottom: -12,
      zIndex: 10,
      width: "100%",
      position: "relative",
    },
    tab: {
      minWidth: 90,
      paddingVertical: 8,
      paddingHorizontal: 18,
      backgroundColor: "rgb(99, 150, 57)",
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      marginHorizontal: -8,
      marginBottom: 0,
      alignItems: "center",
      elevation: 2,
      borderWidth: 2,
      borderColor: "#7bb661",
      borderBottomWidth: 0,
      position: "relative",
      top: 12,
      zIndex: 1,
    },
    tabActive: {
      backgroundColor: "rgb(99, 150, 57)",
      elevation: 6,
      zIndex: 2,
      borderColor: "#fad21e",
      top: 0,
    },
    tabText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 15,
    },
    tabTextActive: {
      color: "white",
    },
  });
  if (!fontsLoaded || isCheckingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text>Cargando...</Text>
      </View>
    );
  }

  // Responsive tab navigation for small screens
  const renderTabs = () => (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginBottom: 0,
        position: "relative",
        zIndex: 10,
      }}
    >
      <View style={folderTabStyles.tabRow}>
        {[
          { key: "profile", label: "Stats" },
          { key: "history", label: "History" },
          { key: "friends", label: "Friends" },
        ].map((tab, idx) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              folderTabStyles.tab,
              activeCard === tab.key && folderTabStyles.tabActive,
              idx === 0 ? { borderTopLeftRadius: 12 } : {},
              idx === 2 ? { borderTopRightRadius: 12 } : {},
              activeCard === tab.key ? { marginBottom: -4 } : {},
              { borderBottomColor: "transparent" },
            ]}
            onPress={() => setActiveCard(tab.key as typeof activeCard)}
          >
            <Text
              style={[
                folderTabStyles.tabText,
                activeCard === tab.key && folderTabStyles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Main cards rendering (profile, history, friends)
  const renderCards = () => (
    <View
      style={
        isSmallScreen
          ? [dynamicStyles.card, { marginTop: 0, paddingTop: 32 }]
          : dynamicStyles.rowCards
      }
    >
      {/* Profile Card */}
      {(isSmallScreen ? activeCard === "profile" : true) && (
        <View style={dynamicStyles.card}>
          <View style={styles.profileSection}>
            <Image
              source={
                profileData?.photoUrl?.startsWith("http")
                  ? { uri: profileData.photoUrl }
                  : require("../assets/images/no_pfp.jpg")
              }
              style={styles.profileImg}
            />
            <Text style={styles.cardTitle}>{profileData?.username}</Text>
            {!isSmallScreen && (
              <Text style={styles.badgeGreen}>{profileData?.role}</Text>
            )}
            <Text style={styles.gamerTag}>{profileData?.email}</Text>
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
          <View style={styles.gameStats}>
            <View style={styles.gameItem}>
              <View style={styles.gameIcon}>
                <FontAwesome name="flag" size={24} color="#069809" />
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>Hole in one</Text>
                <Text style={styles.gameDetail}>Range: challenguer lol</Text>
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
      )}
      {/* History Card */}
      {(isSmallScreen ? activeCard === "history" : true) && (
        <View style={dynamicStyles.card}>
          <Text style={styles.cardTitle}>History</Text>
          <View style={styles.lastGameSection}>
            <Text style={styles.lastGameTitle}>Last Game Played</Text>
            <Text style={styles.lastGameDetail}>"Golf Masters 2025"</Text>
            <Text style={styles.lastGameSubDetail}>Date: 2025-06-01</Text>
            <Text style={styles.lastGameSubDetail}>Score: 72 (-1)</Text>
            <Text style={styles.lastGameSubDetail}>Traps Activated: 3</Text>
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
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              <FontAwesome name="crosshairs" size={16} /> Total hoyos anotados:
              87%
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
              <Text>45 hoyos seguidos</Text>
            </View>
          </View>
        </View>
      )}
      {/* Friends Card (CRUD) */}
      {(isSmallScreen ? activeCard === "friends" : true) && (
        <FriendsCard
          friends={friends}
          handleEditFriend={handleEditFriend}
          handleDeleteFriend={handleDeleteFriend}
          showAddFriendModal={showAddFriendModal}
          setShowAddFriendModal={setShowAddFriendModal}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          handleAddFriend={handleAddFriend}
        />
      )}
      {/* Delete Friend Modal (shared for all screens) */}
      {showDeleteModal && friendToDelete && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 28,
              width: 340,
              shadowColor: "#107C10",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#e53e3e",
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              Remove Friend
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              Are you sure you want to remove{" "}
              <Text style={{ fontWeight: "bold" }}>{friendToDelete.name}</Text>{" "}
              from your friends?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#e53e3e",
                  padding: 10,
                  borderRadius: 8,
                  minWidth: 80,
                  marginRight: 8,
                }}
                onPress={confirmDeleteFriend}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#e8f5e9",
                  padding: 10,
                  borderRadius: 8,
                  minWidth: 80,
                  marginLeft: 8,
                }}
                onPress={cancelDeleteFriend}
              >
                <Text
                  style={{
                    color: "#107C10",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/BG IMG GLF.png")}
      style={styles.imageBg}
      resizeMode="cover"
    >
      <View
        style={[
          styles.container,
          { backgroundColor: "rgba(255, 255, 255, 0)", flex: 1 },
        ]}
      >
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
        <View
          style={[
            styles.mainContentWrapper,
            { marginTop: isSmallScreen ? 48 : 0, flex: 1, minHeight: "100%" },
          ]}
        >
          {isSmallScreen ? (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {renderTabs()}
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {renderCards()}
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              contentContainerStyle={styles.mainContent}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={false}
            >
              {renderCards()}
            </ScrollView>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

interface Friend {
  id: string;
  name: string;
}

interface FriendsCardProps {
  friends: Friend[];
  handleEditFriend: (friend: Friend) => void;
  handleDeleteFriend: (friend: Friend) => void;
  showAddFriendModal: boolean;
  setShowAddFriendModal: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Friend[];
  handleAddFriend: (user: Friend) => void;
}

const FriendsCard: React.FC<FriendsCardProps> = ({
  friends,
  handleEditFriend,
  handleDeleteFriend,
  showAddFriendModal,
  setShowAddFriendModal,
  searchQuery,
  setSearchQuery,
  searchResults,
  handleAddFriend,
}) => {
  const dynamicStyles = StyleSheet.create({
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
  });

  // Ay yo, new design for the friends card just dropped
  return (
    <View style={dynamicStyles.card}>
      <Text style={styles.cardTitle}>Friends</Text>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#107C10",
          borderRadius: 20,
          paddingVertical: 10,
          paddingHorizontal: 18,
          alignSelf: "center",
          marginBottom: 12,
        }}
        onPress={() => setShowAddFriendModal(true)}
      >
        <FontAwesome name="user" size={20} color="#fad21e" />
        <Text
          style={{
            color: "#fad21e",
            fontWeight: "bold",
            fontSize: 17,
            marginLeft: 10,
          }}
        >
          Add Friend
        </Text>
      </TouchableOpacity>
      {/* Friends List */}
      {friends.length === 0 ? (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 16 }}>
          No friends yet.
        </Text>
      ) : (
        friends.map((friend: Friend, idx: number) => (
          <View
            key={friend.id || idx}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(232,245,233,0.5)",
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
              shadowColor: "#107C10",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View style={{ marginRight: 12 }}>
              <FontAwesome name="user" size={28} color="#107C10" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                {friend.name}
              </Text>
              <Text style={{ color: "#fad21e", fontSize: 13 }}>
                Status: <Text style={{ color: "#fff" }}>On the Course</Text>
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleEditFriend(friend)}
              style={{ marginLeft: 8 }}
              accessibilityLabel="View Friend Stats"
            >
              <FontAwesome name="star" size={20} color="#fad21e" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteFriend(friend)}
              style={{ marginLeft: 8 }}
              accessibilityLabel="Remove Friend"
            >
              <FontAwesome name="trash" size={20} color="#e53e3e" />
            </TouchableOpacity>
          </View>
        ))
      )}
      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 28,
              width: 340,
              shadowColor: "#107C10",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#107C10",
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              Add a Golfin Buddy
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <FontAwesome name="search" size={18} color="#107C10" />
              <Text style={{ marginLeft: 10, color: "#107C10", fontSize: 16 }}>
                Search:
              </Text>
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: 10,
                  borderWidth: 1,
                  borderColor: "#fad21e",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  height: 38,
                  fontSize: 16,
                  color: "#333",
                  backgroundColor: "#f0fff4",
                }}
                placeholder="Type username..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={{ marginTop: 8, marginBottom: 8 }}>
              {searchResults.length === 0 ? (
                <Text
                  style={{
                    color: "#107C10",
                    fontSize: 15,
                    textAlign: "center",
                    marginTop: 12,
                  }}
                >
                  No users found.
                </Text>
              ) : (
                searchResults.map((user: Friend, idx: number) => (
                  <View
                    key={user.id || idx}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#e8f5e9",
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        color: "#107C10",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {user.name}
                    </Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#fad21e",
                        borderRadius: 8,
                        padding: 8,
                      }}
                      onPress={() => handleAddFriend(user)}
                    >
                      <FontAwesome name="plus" size={18} color="#107C10" />
                      <Text
                        style={{
                          color: "#107C10",
                          fontSize: 16,
                          fontWeight: "bold",
                          marginLeft: 6,
                        }}
                      >
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
            <TouchableOpacity
              style={{
                marginTop: 18,
                alignSelf: "center",
                padding: 10,
                backgroundColor: "#e8f5e9",
                borderRadius: 10,
              }}
              onPress={() => setShowAddFriendModal(false)}
            >
              <Text
                style={{ color: "#107C10", fontSize: 17, fontWeight: "bold" }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageBg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f0fff4",
  },
  mainContent: {
    flex: 1,
    padding: 20,
    zIndex: 0,
    marginLeft: 25, //This right here is the key to have the maincontent not clip into the sidebar
  },
  sidebarAbsolute: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  mainContentWrapper: {
    flex: 1,
    flexDirection: "column",
    zIndex: 0,
    marginLeft: 55,
    marginRight: 10,
  },
  hamburgerButton: {
    // margin: 15,
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
