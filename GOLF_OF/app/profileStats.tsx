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
  Modal,
  Button,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable'; //animacionesss
import Sidebar from "@/components/Structures/Sidebar";
// import { Text } from '@/components/Themed';
import { useFonts } from "expo-font";
import { checkAuthToken } from "@/utils/auth";
import { getProfile } from "@/utils/api";
import FriendCard  from "../components/UserComponents/Friends/FriendCard"
import { boolean } from "zod";
import * as ImagePicker from 'expo-image-picker';
import {uploadImageToCloudinary} from "../components/ProfilePictureUploader"
import axios from 'axios';
import { Platform } from 'react-native';
interface UserStats{
  points: number;
  position: number;
  shots: number;
  springedTraps: number;
  karmaTrigger: number;
  karmaSpent: number;
  won: number;
}
interface Game{
  id: String;
  winner: String;
  players: Players[];
  course: String;
  totalTime: number;
  totalSpringedTraps: number;
  date: Date;
}

interface Players{
  username: String;
}
interface Achievement{
  title: String;
  description: String;
}
interface GameHistoryEntry {
  game: Game;        // datos de la colección 'games'
  userStats: UserStats;  // stats personales de ese usuario
}


interface UserProfileDTO {
  id: string;
  username: string;
  email: string;
  photoUrl: string;
  role: string;
  gameHistory?: GameHistoryEntry[]; 
  achievements: Achievement[];
  friends: string[];
  stats: UserStats;
}

const gamesPerPage = 3;


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

  const phoneURL = "https://birth-classics-ent-bread.trycloudflare.com";
  const [isEditing, setIsEditing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null); // preview temporal
  // Para manejar la actualización del username en el modal
  const [editingUsername, setEditingUsername] = useState<string>("");

  // Para manejar la foto en edición
  const [editingPhotoUrl, setEditingPhotoUrl] = useState<string>("");
  //Esto es para lo de las paginas que no se amontone todo
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((profileData?.gameHistory?.length || 0) / gamesPerPage);
  const isWeb = Platform.OS === 'web';
  const paginatedGames = profileData?.gameHistory?.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );
    const openEditModal = () => {
    setEditingUsername(profileData?.username || "");
    setEditingPhotoUrl(profileData?.photoUrl || "");
    setImageUri(profileData?.photoUrl || null); // preview
    setModalVisible(true);
  };
    const onUploadSuccess = (url: string) => {
    setEditingPhotoUrl(url);
    setImageUri(url);
  };
  const pickImageAndPreview = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    const localUri = result.assets[0].uri;
    setTempImageUri(localUri); // solo para preview
  }
};
  
const pickImageAndUpload = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: Platform.OS === 'web', // solo en web pedimos base64
  });

  if (result.canceled) return;

  if (Platform.OS === 'web') {
    // En web, enviamos base64 en JSON
    const base64 = result.assets[0].base64;
    if (!base64) {
      console.error('No se obtuvo base64 de la imagen');
      return;
    }
    const base64Img = `data:image/jpeg;base64,${base64}`;

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/ddxbr2ctr/image/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64Img,
          upload_preset: 'golfin_upload',
        }),
      });

      const data = await response.json();
      console.log('Respuesta Cloudinary (web):', data);

      if (data.secure_url) {
        setImageUri(data.secure_url);
        setTempImageUri(data.secure_url);
      } else {
        console.error('Error al subir imagen (web):', data);
      }
       if (!result.canceled && result.assets.length > 0) {
    setTempImageUri(result.assets[0].uri); // sólo vista previa
    }
    } catch (error) {
      console.error('Error en la petición a Cloudinary (web):', error);
    }
  } else {
    // En móvil, enviamos FormData con archivo
    const localUri = result.assets[0].uri;
    if (typeof localUri !== 'string') {
      console.error('La URI no es una cadena:', localUri);
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);
    formData.append('upload_preset', 'golfin_upload');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/ddxbr2ctr/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Respuesta Cloudinary (móvil):', data);

      if (data.secure_url) {
        setImageUri(data.secure_url);
      } else {
        console.error('Error al subir imagen (móvil):', data);
      }
       if (!result.canceled && result.assets.length > 0) {
    setTempImageUri(result.assets[0].uri); // solo vista previa
  }
    } catch (error) {
      console.error('Error en la petición a Cloudinary (móvil):', error);
    }
  }
};



const saveProfileChanges = async () => {
  try {
    let token: string | null;

    if (isWeb) {
        token = localStorage.getItem("jwt_token");
    } else {
        token = await AsyncStorage.getItem("jwt_token");
    }
    if (!token) throw new Error("Token no encontrado");

    let uploadedUrl = profileData?.photoUrl;

    //subir imagen si es base64 (web)
    if (tempImageUri?.startsWith("data:image/")) {
      const res = await fetch('https://api.cloudinary.com/v1_1/ddxbr2ctr/image/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: tempImageUri,
          upload_preset: 'golfin_upload',
        }),
      });
      const data = await res.json();
      if (data.secure_url) {
        uploadedUrl = data.secure_url;
      } else {
        throw new Error("Error al subir imagen (web)");
      }
    }


    else if (tempImageUri && tempImageUri.startsWith("http")) {
      uploadedUrl = tempImageUri;
    }

    //guardar en backend
    const res = await fetch(`${phoneURL}/users/update-profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: editingUsername,
        photoUrl: uploadedUrl,
      }),
    });

    if (!res.ok) throw new Error("Error actualizando perfil");

    //actualizar en frontend
    setProfileData(prev =>
      prev
        ? {
            ...prev,
            username: editingUsername,
            photoUrl: uploadedUrl ?? prev.photoUrl,
          }
        : prev
    );

    setTempImageUri(null);
    setModalVisible(false);
  } catch (error) {
    console.error("Error guardando perfil:", error);
    
  }
};



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
        
        
      
      }catch(error){
        console.error("Error al obtener los datos del perfil", error)
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
                  tempImageUri
                    ? { uri: tempImageUri }
                    : profileData?.photoUrl?.startsWith("http")
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
              <TouchableOpacity onPress={openEditModal}>
              <FontAwesome
                name="edit"
                size={24}
                color="#069809"
                style={styles.socialIcon}
                onPress={() => setIsEditing(true)}
              />
              </TouchableOpacity>
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
      {/* {(isSmallScreen ? activeCard === "friends" : true) && (
        <FriendCard
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
      )} */}
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
     <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
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
                <View
                  style={[dynamicStyles.card, { marginTop: 0, paddingTop: 32 }]}
                >
                  {/* Card Content */}
                  {activeCard === "profile" && (
                    <View style={dynamicStyles.card}>
                      {/* Profile Card */}
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
                       <Text style={styles.gamerTag}>{profileData?.email}</Text>
                        <View style={styles.socialIcons}>
                          <TouchableOpacity onPress={openEditModal}>
                          <FontAwesome
                            name="edit"
                            size={24}
                            color="#069809"
                            style={styles.socialIcon}
                          />
                          </TouchableOpacity>
                          <FontAwesome
                            name="sign-out"
                            size={24}
                            color="#069809"
                            style={styles.socialIcon}
                          />
                        </View>
                      </View>
                      <View style={styles.divider} />
                         <Modal visible={modalVisible} animationType="slide" transparent={true}>
                        <View style={styles.modalBackground}>
                          <View style={styles.modalContainer}>
                            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
                              Editar Perfil
                            </Text>

                            <TextInput
                              value={editingUsername}
                              onChangeText={setEditingUsername}
                              placeholder="Nuevo nombre"
                              style={styles.input}
                            />

               
                            <View style={{ marginVertical: 10 }}>
                              <TouchableOpacity
                                onPress={pickImageAndUpload}
                                style={{
                                  backgroundColor: "#069809",
                                  padding: 10,
                                  borderRadius: 5,
                                  marginBottom: 10,
                                }}
                              >
                                <Text style={{ color: "white", textAlign: "center" }}>
                                  Cambiar foto
                                </Text>
                              </TouchableOpacity>

                              {/* Preview de imagen */}
                              {imageUri && (
                                <Image
                                  source={{ uri: imageUri }}
                                  style={{ width: 120, height: 120, borderRadius: 60 }}
                                />
                              )}
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 15,
                              }}
                            >
                              <Button
                                title="Cancelar"
                                color="red"
                                onPress={() =>  {setTempImageUri(null); 
                                  setModalVisible(false)}}
                              />
                              <Button title="Guardar" onPress={() => saveProfileChanges()} />
                            </View>
                          </View>
                        </View>
                      </Modal>

                      {/* Game Stats */}
                      <View style={styles.gameStats}>
                        <View style={styles.gameItem}>
                          <View style={styles.gameIcon}>
                            <FontAwesome
                              name="flag"
                              size={24}
                              color="#069809"
                            />
                          </View>
                          <View style={styles.gameInfo}>
                            <Text style={styles.gameName}>Average Points</Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.points}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.gameItem}>
                          <View style={styles.gameIcon}>
                            <FontAwesome
                              name="clock-o"
                              size={24}
                              color="#069809"
                            />
                          </View>
                          <View style={styles.gameInfo}>
                            <Text style={styles.gameName}>Average Postion</Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.position}
                            </Text>
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
                            <Text style={styles.gameName}>
                              Shots
                            </Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.shots}
                            </Text>
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
                            <Text style={styles.gameName}>
                              SpringedTraps
                            </Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.springedTraps}
                            </Text>
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
                            <Text style={styles.gameName}>
                              Wins
                            </Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.won}
                            </Text>
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
                            <Text style={styles.gameName}>
                              Karma Spent
                            </Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.karmaSpent}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                  
                  {activeCard === "history" && (
                    <>
                  {profileData?.gameHistory?.length ? (
                    <View style={dynamicStyles.card}>
                      {paginatedGames?.length ? (
                    <View style={dynamicStyles.card}>
                      {/* History Card */}
                      <Text style={styles.cardTitle}>History</Text>
                      {/* Last Game Played Section */}
                      {paginatedGames.map((entry, index) => (
                        <Animatable.View
                          key={index}
                          animation="fadeInUp"
                          delay={index * 200}
                          style={styles.lastGameSection}
                        >
                          <View style={styles.lastGameSection}>
                            <Text style={styles.lastGameTitle}>Course: {entry.game.course}</Text>
                            <Text style={styles.lastGameSubDetail}>
                              Date: {new Date(entry.game.date).toLocaleDateString()}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Players: {entry.game.players.map(p => p.username).join(", ")}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Traps Activated: {entry.game.totalSpringedTraps}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Total Time: {entry.game.totalTime}s
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Your Shots: {entry.userStats.shots}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Your Points: {entry.userStats.points}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Position: {entry.userStats.position}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Karma Obtained: {entry.userStats.karmaTrigger}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Karma Spent: {entry.userStats.karmaSpent}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Your Traps Activated: {entry.userStats.springedTraps}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Won: {entry.userStats.won ? "Yes" : "No"}
                            </Text>
                            <View style={styles.divider} />
                            <Image source={require('../assets/images/MiniCourse1.jpg')} style={styles.imgTemporada} />
                          </View>
                        </Animatable.View>
                      ))}
                      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                        {[...Array(totalPages)].map((_, pageIndex) => (
                          <TouchableOpacity
                            key={pageIndex}
                            onPress={() => setCurrentPage(pageIndex + 1)}
                            style={{
                              marginHorizontal: 5,
                              padding: 8,
                              borderRadius: 6,
                              backgroundColor: currentPage === pageIndex + 1 ? "#555" : "#ccc",
                            }}
                          >
                            <Text style={{ color: "#fff" }}>{pageIndex + 1}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ) : null}

                        {/* Example progress bar (static) */}
                      <View style={styles.progressContainer}>
                        <Text style={styles.progressLabel}>
                          <FontAwesome name="crosshairs" size={16} /> Total
                          hoyos anotados: 87%
                        </Text>
                        <View style={styles.progressBarBg}>
                          <View
                            style={[styles.progressBar, { width: "87%" }]}
                          />
                        </View>
                      </View>

                      {/* <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>
                      <FontAwesome name="user" size={16} /> Friends: 89%
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBar, { width: "89%" }]} />
                    </View>
                  </View> */}
                      <View style={styles.divider} />
                      <Text style={styles.sectionTitle}>Golf Achievements</Text>
                      {profileData?.achievements?.map((ach, index) => (
                      <Animatable.View
                        key={index}
                        animation="fadeInUp"
                        delay={index * 200}
                        style={styles.achievementItem}
                      >
                        <FontAwesome name="trophy" size={24} color="#FFD700" style={styles.achievementIcon} />
                        <View style={styles.achievementText}>
                          <Text style={styles.achievementTitle}>{ach.title}</Text>
                          <Text>{ach.description}</Text>
                        </View>
                      </Animatable.View>
                    ))}
                      </View>
                  ): (
                  <Text> No game history availabe.</Text>

                  )}
                  </>
                  )}
                  {activeCard === "friends" && ( //YOU LEFT OFF HERE
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
                </View>
              </View>
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
                        source={
                          profileData?.photoUrl?.startsWith("http")
                            ? { uri: profileData.photoUrl }
                            : require("../assets/images/no_pfp.jpg")
                        }
                        style={styles.profileImg}
                      />
                    <Text style={styles.cardTitle}>{profileData?.username}</Text>
                    <Text style={styles.badgeGreen}>{profileData?.role}</Text>
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
                  {/* Game Stats */}
                   <View style={styles.gameStats}>
                        <View style={styles.gameItem}>
                          <View style={styles.gameIcon}>
                            <FontAwesome
                              name="flag"
                              size={24}
                              color="#069809"
                            />
                          </View>
                          <View style={styles.gameInfo}>
                            <Text style={styles.gameName}>Average Points</Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.points}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.gameItem}>
                          <View style={styles.gameIcon}>
                            <FontAwesome
                              name="clock-o"
                              size={24}
                              color="#069809"
                            />
                          </View>
                          <View style={styles.gameInfo}>
                            <Text style={styles.gameName}>Average Postion</Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.position}
                            </Text>
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
                            <Text style={styles.gameName}>
                              Shots
                            </Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.shots}
                            </Text>
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
                            <Text style={styles.gameName}>
                              SpringedTraps
                            </Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.springedTraps}
                            </Text>
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
                            <Text style={styles.gameName}>
                              Wins
                            </Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.won}
                            </Text>
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
                            <Text style={styles.gameName}>
                              Karma Spent
                            </Text>
                            <Text style={styles.gameDetail}>
                              {profileData?.stats.karmaSpent}
                            </Text>
                          </View>
                        </View>
                      </View>
                </View>
                {/* History Card */}
                <View style={dynamicStyles.card}>
                  <Text style={styles.cardTitle}>History</Text>
                      {/* Last Game Played Section */}
                        {paginatedGames?.map((entry, index) => (
                        <Animatable.View
                          key={index}
                          animation="fadeInUp"
                          delay={index * 200}
                          style={styles.lastGameSection}
                        >
                          <View style={styles.lastGameSection}>
                            <Text style={styles.lastGameTitle}>Course: {entry.game.course}</Text>
                            <Text style={styles.lastGameSubDetail}>
                              Date: {new Date(entry.game.date).toLocaleDateString()}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Players: {entry.game.players.map(p => p.username).join(", ")}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Total Traps Activated: {entry.game.totalSpringedTraps}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Total Time: {entry.game.totalTime}s
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Your Shots: {entry.userStats.shots}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Your Points: {entry.userStats.points}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Position: {entry.userStats.position}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Karma Obtained: {entry.userStats.karmaTrigger}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Karma Spent: {entry.userStats.karmaSpent}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Your Traps Activated: {entry.userStats.springedTraps}
                            </Text>
                            <Text style={styles.lastGameSubDetail}>
                              Won: {entry.userStats.won ? "Yes" : "No"}
                            </Text>
                            <View style={styles.divider} />
                            <Image source={require('../assets/images/MiniCourse1.jpg')} style={styles.imgTemporada} />
                          </View>
                        </Animatable.View>
                        ))}
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                          {[...Array(totalPages)].map((_, pageIndex) => (
                            <TouchableOpacity
                              key={pageIndex}
                              onPress={() => setCurrentPage(pageIndex + 1)}
                              style={{
                                marginHorizontal: 5,
                                padding: 8,
                                borderRadius: 6,
                                backgroundColor: currentPage === pageIndex + 1 ? "#555" : "#ccc",
                              }}
                            >
                              <Text style={{ color: "#fff" }}>{pageIndex + 1}</Text>
                            </TouchableOpacity>
                            ))}
                            </View>
                  {/* Example progress bar (static) */}
                  {/* <View style={styles.progressContainer}>
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
                  </View> */}

                 <View style={styles.divider} />
                      <Text style={styles.sectionTitle}>Golf Achievements</Text>
                      {profileData?.achievements?.map((ach, index) => (
                      <Animatable.View
                        key={index}
                        animation="fadeInUp"
                        delay={index * 200}
                        style={styles.achievementItem}
                      >
                        <FontAwesome name="trophy" size={24} color="#FFD700" style={styles.achievementIcon} />
                        <View style={styles.achievementText}>
                          <Text style={styles.achievementTitle}>{ach.title}</Text>
                          <Text>{ach.description}</Text>
                        </View>
                      </Animatable.View>
                    ))}
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
                      {profileData?.friends.map((friendId) => (
                        <FriendCard
                          key={friendId}
                          username={`Usuario-${friendId}`}
                          isOnline={Math.random() < 0.5}
                        />
                      ))}
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
    </SafeAreaView>
    </SafeAreaProvider>
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
   modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
  },
});

export default App;
