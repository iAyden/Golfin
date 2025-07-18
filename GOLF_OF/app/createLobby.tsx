import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Animated, ImageBackground, useWindowDimensions,SafeAreaView,
  ScrollView,Image,TouchableOpacity,Dimensions,ImageSourcePropType,Alert, Easing } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import socketService from "../components/methods/socketService";

// Definicion de tipos
type UserCardType = {
  id: string;
  name: string;
  role: string; // OWNER or VISITOR
  score: number;
  karma: number;    
  image: ImageSourcePropType;
};

type IconsType = {
  karmaIcon: ImageSourcePropType;
  scoreIcon: ImageSourcePropType;
  clock: ImageSourcePropType; 
  ramp: ImageSourcePropType;
  slap: ImageSourcePropType;
  obstacle: ImageSourcePropType;
  fan: ImageSourcePropType;
  vipRamp: ImageSourcePropType;
  cart: ImageSourcePropType;
  earthquake: ImageSourcePropType;
  vipSlap: ImageSourcePropType;
  movingHole: ImageSourcePropType;
};

type ShopItemType = {
  id: string;
  name: string;
  icon: ImageSourcePropType;
  cost: number;
  backgroundColor: string;
};

interface PlayerStats {
  position: number;
  shots: number;
  points: number;
  springedTraps: number;
}

interface Player {
  username: string;
  points: number;
  karma: number;
  code: string;
  BoughtTraps: any;
  stats: PlayerStats;
}

interface PartyData {
  owner: string;
  code: string;
  members: Player[];
}

type User = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  role: string;
  score: number;
  karma: number;
};


// Dimensiones y tipos de dispositivo
const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

export default function CreateLobbyScreen() {
  // Fuentes y dimensiones
  const [fontsLoaded] = useFonts({ gharison: require("../assets/fonts/gharison.ttf") });
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const isSmallScreen = windowWidth < 700;

  // Estados del formulario
  const [lobbyCode, setLobbyCode] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [isReady, setIsReady] = useState(false);

  // Estados del lobby
  const [currentView, setCurrentView] = useState<"joinCreate" | "lobby">("joinCreate");
  const [partyData, setPartyData] = useState<PartyData | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Animaciones de botones
  const joinScale = useRef(new Animated.Value(1)).current;
  const createScale = useRef(new Animated.Value(1)).current;

  // Animación de volteo de carta
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const frontInterpolate = flipAnimation.interpolate({  inputRange: [0, 180],  outputRange: ["0deg", "160deg"] });
  const backInterpolate = flipAnimation.interpolate({  inputRange: [0, 180],   outputRange: ["180deg", "360deg"] });
  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };
  const [showFront, setShowFront] = useState(true);

  // Iconos
  const icons: IconsType = { 
    karmaIcon: require("@/assets/images/fireC.png"), 
    scoreIcon: require("@/assets/images/starC.png"), 
    clock: require("@/assets/images/clock.png"),
    ramp: require("@/assets/images/fireC.png"),
    slap: require("@/assets/images/fireC.png"),
    obstacle: require("@/assets/images/fireC.png"),
    fan: require("@/assets/images/fireC.png"),
    vipRamp: require("@/assets/images/fireC.png"),
    cart: require("@/assets/images/fireC.png"),
    earthquake: require("@/assets/images/fireC.png"),
    vipSlap: require("@/assets/images/fireC.png"),
    movingHole: require("@/assets/images/fireC.png"),
  };

  // Estados del juego
  const [seconds, setSeconds] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [userCards, setUserCards] = useState<UserCardType[]>([]);
  const owner = isOwner ? "Empezar" : "En espera";
  const isDisabled = !isOwner;

  // Puntos y karma
  const [points, setPoints] = useState(0);
  const [karma, setKarma] = useState(0);
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [prepTime, setPrepTime] = useState<number | null>(null);
  const [turnTime, setTurnTime] = useState<number>(0);
  const [showTurnModal, setShowTurnModal] = useState(false);


  // TIENDA
  const shopItems: ShopItemType[] = [
    { id: "1", name: "Rampa", icon: icons.ramp, cost: 600, backgroundColor: "#2ecc71" },
    { id: "2", name: "Cachetada lateral", icon: icons.slap, cost: 500, backgroundColor: "#2ecc71" },
    { id: "3", name: "Obstáculo", icon: icons.obstacle, cost: 100, backgroundColor: "#2ecc71" },
    { id: "4", name: "Ventilador", icon: icons.fan, cost: 250, backgroundColor: "#2ecc71" },
    { id: "5", name: "Rampa VIP", icon: icons.vipRamp, cost: 350, backgroundColor: "#2ecc71" },
    { id: "6", name: "Carrito", icon: icons.cart, cost: 700, backgroundColor: "#2ecc71" },
    { id: "7", name: "Terremoto", icon: icons.earthquake, cost: 400, backgroundColor: "#2ecc71" },
    { id: "8", name: "Cachetada VIP", icon: icons.vipSlap, cost: 300, backgroundColor: "#2ecc71" },
    { id: "9", name: "Hoyo móvil", icon: icons.movingHole, cost: 500, backgroundColor: "#2ecc71" },
  ];

  const router = useRouter();
////////////////////// WEBSOCKETS ///////////////////////////////////
useEffect(() => {
  socketService.connect("ws://localhost:1337/game");

  const handleCreateParty = (payload: PartyData) => {
    if (payload?.code) {
      console.log("Payload members:", payload.members);
      setPartyData(payload);
      setIsOwner(payload.owner === userName);
      setCurrentView("lobby");

      const currentPlayer = payload.members.find(m => m.username === userName);
      if (currentPlayer) {
        console.log("Payload members:", payload.members);
        setPoints(currentPlayer.points);
        setKarma(currentPlayer.karma);
      }

      setUserCards(payload.members.map(member => ({
        id: member.username,
        name: member.username,
        role: member.username === payload.owner ? "Owner" : "VISITOR",
        score: member.points,
        karma: member.karma,
        image: require("../assets/images/golf.png")
      })));
    }
     else { setError("No se pudo crear la partida"); }
  };

  const handleJoinParty = (payload: PartyData) => {
    if (payload?.code) {
      console.log("Payload members:", payload.members);
      setPartyData(payload);
      setIsOwner(payload.owner === userName);
      setCurrentView("lobby");

      const currentPlayer = payload.members.find(m => m.username === userName);
      if (currentPlayer) {
        console.log("Payload members:", payload.members);
        setPoints(currentPlayer.points);
        setKarma(currentPlayer.karma);
      }

      setUserCards(payload.members.map(member => ({
        id: member.username,
        name: member.username,
        role: member.username === payload.owner ? "OWNER" : "VISITOR",
        score: member.points,
        karma: member.karma,
        image: require("../assets/images/golf.png")
      })));
    } 
    else { setError("Error al unirse al juego"); }
  };

  const handlePlayerJoined = (updatedParty: PartyData) => {
    setPartyData(updatedParty);
    const currentPlayer = updatedParty.members.find(m => m.username === userName);
    if (currentPlayer) { setPoints(currentPlayer.points); setKarma(currentPlayer.karma); }

    setUserCards(updatedParty.members.map(member => ({
      id: member.username,
      name: member.username,
      role: member.username === updatedParty.owner ? "OWNER" : "VISITOR",
      score: member.points,
      karma: member.karma,
      image: require("../assets/images/golf.png")
    })));
  };

const handleKarmaTrigger = (payload: { username: string; karma: number }) => {
  console.log("TRAMPA trigueada:", payload.username, payload.karma);
};


  const handleBuyTrap = (payload: { Karma: number }) => { if (payload.Karma !== undefined) setKarma(payload.Karma); };


  /////////////////// REAL TIME updater /////////////
  const handleGlobalTimer = (payload: { time: number }) => { setSeconds(payload.time); };
  //////////////////////////////////////////////////

  //////////////////////// TURNOS DE LOS USUARIOS ////////////////////////
const handleStartTimer = (payload: { time: number }) => { setPrepTime(payload.time); };

const handleTurnTimer = (payload: { time: number }) => {
  setTurnTime(payload.time);

  if (payload.time === 0) {
    setShowTurnModal(false);
    setIsMyTurn(false);
    setPrepTime(null);
  }
};

const handleStartUserTurn = (payload: any) => {
  if (payload === null) {

    setPrepTime(null);
    setShowTurnModal(true);
    setIsMyTurn(true);
  } else {
    setShowTurnModal(false);
    setIsMyTurn(false);
    setPrepTime(null);
    setTurnTime(0);
  }
};

///////////////////////// PLayer finished que NO FUNCIONA//////////////////////

const handlePlayerFinished = (payload: any) => {
  console.log("EL PLAYERFINISHED ESTA FUNCIONANDO POR FAVOR FUNCIONA");
  setShowTurnModal(false);   
};
/////////////////////////////////////////////////////////////////////////////

  ///////////////// START GAME HANDLER /////////////////////
const handleStartGame = (payload: PartyData) => {
  setGameStarted(true);
  setSeconds(0);
  setPartyData(payload);
  const currentPlayer = payload.members.find(m => m.username === userName);
  if (currentPlayer) {
    console.log("Payload members:", payload.members);
    setKarma(currentPlayer.karma); 
    setPoints(currentPlayer.stats?.points ?? 0);
  }

  setUserCards(payload.members.map(member => ({
    id: member.username,
    name: member.username,
    role: member.username === payload.owner ? "OWNER" : "VISITOR",
    score: member.points,
    karma: member.karma,
    image: require("../assets/images/golf.png")
  })));
};


  ////////////////////////// Aqui los handlers que reccionan por cada eventi ////////////////////////
  socketService.on("createParty", handleCreateParty);
  socketService.on("joinParty", handleJoinParty);
  socketService.on("playerJoined", handlePlayerJoined);
  socketService.on("globalTimer", handleGlobalTimer);
  socketService.on("karmaTrigger", handleKarmaTrigger);
  socketService.on("buyTrap", handleBuyTrap);
  socketService.on("playerFinished", handlePlayerFinished);
  socketService.on("startTimer", handleStartTimer);
  socketService.on("startUserTurn", handleStartUserTurn);
  socketService.on("turnTimer", handleTurnTimer);
  socketService.on("startGame", handleStartGame);
  

  setTimeout(() => setIsReady(true), 500);

  return () => {
    socketService.off("createParty", handleCreateParty);
    socketService.off("joinParty", handleJoinParty);
    socketService.off("playerJoined", handlePlayerJoined);
    socketService.off("globalTimer", handleGlobalTimer);
    socketService.off("karmaTrigger", handleKarmaTrigger);
    socketService.off("buyTrap", handleBuyTrap);
    socketService.off("playerFinished", handlePlayerFinished);
    socketService.off("startTimer", handleStartTimer);
    socketService.off("startUserTurn", handleStartUserTurn);
    socketService.off("turnTimer", handleTurnTimer);
    socketService.off("startGame", handleStartGame);
    socketService.close();
  };
}, [userName]);





  // PARTE DEL TIEMPO NO LE MUEVAN
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map(v => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  // Handlers
  const handleJoin = () => {
    if (!lobbyCode.trim()) { ("POR FAVOR INGRESE EL CODIGO"); return; }
    if (!userName.trim()) { setError("POR FAVOR INGRESE SU NOMBRE"); return; }
    socketService.joinLobby(userName, lobbyCode);
  };

  const handleCreate = () => {
    if (!userName.trim()) { setError("POR FAVOR INGRESA SU NOMBRE"); return; }
    socketService.createLobby(userName);
  };

  const startGame = () => {
    if (partyData?.code) {
      socketService.startGame(partyData.code);
      setGameStarted(true);
      setSeconds(0);
    }
  };

  const flipCard = () => {
    if (!gameStarted) { Alert.alert("Espera", "INICIA PRIMERO EL JUEGO"); return; }
    Animated.timing(flipAnimation, {
      toValue: showFront ? 180 : 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => setShowFront(!showFront));
  };

  const buyItem = (itemId: string) => {
    if (!gameStarted) {  Alert.alert("Espera", "INICIA EL JUEGO PRIMERO"); return; }
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;

    if (karma >= item.cost) { socketService.buyTrap(item.name); } 
    else { Alert.alert("Error", "NO TIENES KARMA SUFICIENTE"); }
  };


  useEffect(() => {
  const handleStartGame = (payload: any) => {
    const current = payload.members.find((m: any) => m.username === name);
    if (current) {
      console.log("Karma recibido:", current.karma);
      console.log("Puntos recibidos:", current.stats?.points);
      setKarma(current.karma);
      setPoints(current.stats?.points ?? 0);
    }
  };

  socketService.on("startGame", handleStartGame);
  return () => socketService.off("startGame", handleStartGame);
}, []);

  

  const renderJoinCreateView = () => (
    <View style={styles.card}>
      <Text style={styles.title}>Golfin' Lobby</Text>
      <Text style={styles.subtitle}>Join or create a party!</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Join Party!</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#888"
          value={userName}
          onChangeText={setUserName}
          maxLength={20}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter code"
          placeholderTextColor="#888"
          value={lobbyCode}
          onChangeText={setLobbyCode}
          maxLength={8}
          autoCapitalize="characters"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

      </View>
      <Text style={styles.sectionTitle}>Don't have a code PERRO?</Text>
      <View style={styles.sectionDivider} />
      <View style={styles.section}>
         <Pressable
          onPress={handleJoin}
          onPressIn={() => Animated.spring(joinScale, { toValue: 0.95, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(joinScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start()}
        >
          <Animated.View style={[styles.joinBtn, { transform: [{ scale: joinScale }] }, !isReady && { opacity: 0.5 }]}>
            <Text style={styles.btnText}>Join to a party</Text>
          </Animated.View>
        </Pressable>
      
        <Pressable
          onPress={handleCreate}
          onPressIn={() => Animated.spring(createScale, { toValue: 0.95, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(createScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start()}
        >
          <Animated.View style={[styles.createBtn, { transform: [{ scale: createScale }] }]}>
            <Text style={styles.btnText}>Create a party</Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );

  const renderLobbyView = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* FRENTE DE LA CARTA */}
        <Animated.View
          style={[ styles.cardFace, styles.cardFront, frontAnimatedStyle, { display: showFront ? "flex" : "none" }, ]}>
          <ScrollView contentContainerStyle={styles.frontContent} showsVerticalScrollIndicator={false} >
            <View style={styles.frontHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.mainTitle}>Party</Text>
                <Text style={styles.subtitle}>Party's code: {partyData?.code}</Text>
              </View>

              {gameStarted && (
                <View style={styles.timeDisplayFront}>
                  <Image source={icons.clock} style={styles.iconImageSmall} />
                  <Text style={styles.timeTextFront}>{formatTime(seconds)}</Text>
                </View>
              )}
            </View>

<View style={styles.userCardsContainer}>
  {userCards.map((user) => (
      <View key={user.id} style={[ styles.userCard,  user.name === currentTurnPlayer && { backgroundColor: "#ffd700" } ]}>
            <View style={styles.userInfoContainer}>
                  <Image source={user.image} style={styles.userImage} />
                  <View style={styles.userTextContainer}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                </View>
                <View style={styles.pointsContainerRight}>
                  <View style={styles.pointsRow}>
                    <Image source={icons.scoreIcon} style={styles.iconImage} />
                    <Text style={styles.pointsText}>{(user.score) ? user.score : "0"} </Text>
                  </View>
                  <View style={styles.pointsRow}>
                    <Image source={icons.karmaIcon} style={styles.iconImage} />
                    <Text style={styles.pointsText}>{(user.karma) ? user.karma: "0"}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

        {showTurnModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {prepTime !== null && prepTime > 0 ? (
                <>  
                  <Text style={styles.modalText}>Watch out...</Text>
                  <Text style={styles.timerText}>{prepTime}s missing</Text>
                </>
              ) 
              : /* etse es el ods puntos del ternario */
              (
                isMyTurn && (
                  <>
                    <Text style={styles.modalText}>¡Go ahead!</Text>
                    <Text style={styles.timerText}>{turnTime}s missing</Text>
                  </>
                )
              )}
            </View>
          </View>
        )}

          {userCards.length === 1 && ( <Text style={styles.noUsersText}>There are not users connected.</Text> )}

        {!gameStarted && isOwner && (
            <TouchableOpacity style={[styles.startButton, styles.activeStartButton]} onPress={startGame} >
              <Text style={styles.startButtonText}>Empezar</Text>
            </TouchableOpacity>
          )}

          {gameStarted && (
            <TouchableOpacity style={styles.flipButton} onPress={flipCard} >
              <Text style={styles.flipButtonText}>Ir a la Tienda</Text>
            </TouchableOpacity>

        )}




          </ScrollView>
        </Animated.View>

        {/* TRASERO DE LA CARTA */}
        <Animated.View style={[ styles.cardFace, styles.cardBack, backAnimatedStyle,{ display: showFront ? "none" : "flex" },]}>
          <ScrollView contentContainerStyle={styles.backContent} showsVerticalScrollIndicator={false} >
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Traps</Text>
              <Text style={styles.subtitle}>Use an hability to get karma</Text>
            </View>

            <View style={styles.showStatsContainer}>
              <View style={styles.pointsKarmaContainer}>
                <View style={styles.pointsContainer}>
                  <Text style={styles.pointsText}>
                    <Image source={icons.clock} style={styles.iconImage} />:{" "}
                    {formatTime(seconds)}
                  </Text>
                </View>
                <View style={styles.badPointsContainer}>
                  <Text style={styles.pointsText}>Round: {karma}</Text>
                </View>
              </View>
              <View style={styles.timeContainer}>
                <View style={styles.pointsContainer}>
                  <Text style={styles.pointsText}>
                    <Image source={icons.scoreIcon} style={styles.iconImage} />:{" "}
                    {points}
                  </Text>
                </View>
                <View style={styles.badPointsContainer}>
                  <Text style={styles.pointsText}>
                    <Image source={icons.karmaIcon} style={styles.iconImage} />:{" "}
                    {karma}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.shopGrid}>
              {shopItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[ styles.shopItem, { backgroundColor: item.backgroundColor }, (points < item.cost || !gameStarted) && styles.disabledItem, ]}
                  onPress={() => buyItem(item.id)}
                  disabled={points < item.cost || !gameStarted}
                >
                  <Image source={item.icon} style={styles.itemImage} />
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.cost} pts</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity  style={[styles.flipButton, !gameStarted && styles.disabledButton]} onPress={flipCard}  disabled={!gameStarted} >
              <Text style={styles.flipButtonText}>Back to lobby</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );

  return (
    <View style={[styles.bg, { paddingTop: isSmallScreen ? insets.top || 24 : 0 }]}>
      <ImageBackground 
        source={require("../assets/images/BG IMG GLF.png")} 
        style={styles.imageBg} 
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.cardContainer}>
          {currentView === "joinCreate" ? renderJoinCreateView() : renderLobbyView()}
        </View>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "rgba(15, 76, 45, 0.98)",
  },
  imageBg: {
    flex: 1,
    width: "110%", 
    height: "110%",
    position: "absolute",
    left: "-5%",
    top: "-5%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    paddingHorizontal: isSmallDevice ? 10 : 20,
  },

  // FORMULARIO PARA UNIRSE
  card: {
    backgroundColor: "rgba(40, 120, 57, 0.97)",
    borderRadius: 28,
    padding: isSmallDevice ? 28 : 36,
    width: isSmallDevice ? "92%" : "80%", 
    height: isSmallDevice ? "70%" : "80%", 
    maxWidth: 500,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(122, 199, 12, 0.7)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: isSmallDevice ? 34 : 42, 
    color: "#FBF5C9",
    marginBottom: 12,
    textShadowColor: "rgba(255, 255, 255, 0)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: isSmallDevice ? 26 : 30, 
    color: "rgba(255, 255, 255, 1)",
    marginBottom: isSmallDevice ? 20 : 28,
  },
  section: {
    width: "100%",
    alignItems: "center",
    marginBottom: isSmallDevice ? 12 : 16,
  },
  sectionTitle: {
    color: "rgb(251, 245, 201)",
    fontWeight: "bold",
    fontSize: isSmallDevice ? 16 : 18,
    marginBottom: isSmallDevice ? 15 : 20,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    width: "100%",
    paddingVertical: isSmallDevice ? 18 : 22,  
    paddingHorizontal: 24,                    
    fontSize: isSmallDevice ? 18 : 20,         
    borderRadius: 14,                          
    borderWidth: 3,                            
    borderColor: "#7AC70C",
    marginBottom: isSmallDevice ? 16 : 20,     
    letterSpacing: 1.3,
    height: isSmallDevice ? 60 : 68,           
    textAlignVertical: 'center',              
    shadowColor: "#000",                       
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,                           
  },
  joinBtn: {
    backgroundColor: "#8EE000",
    width: "100%", 
    maxWidth: isSmallDevice ? 180 : 220,
    paddingVertical: isSmallDevice ? 16 : 18,
    paddingHorizontal: 10, 
    borderRadius: 14,
    borderWidth: 4,
    borderColor: "#7AC70C",
    marginTop: isSmallDevice ? 8 : 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, 
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1 }], 
  },
  createBtn: {
    backgroundColor: "#E53838",
    width: "100%",
    paddingVertical: isSmallDevice ? 16 : 18,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "#D33131",
    marginTop: isSmallDevice ? 8 : 12,
  },
  btnText: {
    fontSize: isSmallDevice ? 18 : 20, 
    fontWeight: "800",
    margin: 9,
    letterSpacing: 1.2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "rgba(122, 199, 12, 0.5)",
    width: "100%",
    marginVertical: isSmallDevice ? 12 : 16,
  },
  error: {
    color: "#ff5252",
    fontSize: isSmallDevice ? 12 : 14,
    marginBottom: isSmallDevice ? 8 : 12,
    textAlign: "center",
    fontWeight: "bold",
  },

  safeArea: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  cardFace: {
    width: "90%",
    height: isSmallDevice ? "85%" : "80%",
    maxWidth: 500,
    maxHeight: 800,
    borderRadius: 20,
    position: "absolute",
    backfaceVisibility: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: "hidden",
  },
  cardFront: {
    backgroundColor: "rgba(40, 120, 57, 0.95)",
    borderWidth: 2,
    borderColor: "rgb(122, 199, 12)",
  },
  cardBack: {
    backgroundColor: "rgba(30, 100, 47, 0.95)",
    borderWidth: 2,
    borderColor: "rgb(100, 170, 12)",
  },
  frontContent: {
    flexGrow: 1,
    padding: isSmallDevice ? 16 : 20,
    paddingBottom: isSmallDevice ? 20 : 30,
  },
  backContent: {
    flexGrow: 1,
    padding: isSmallDevice ? 16 : 20,
    paddingBottom: isSmallDevice ? 20 : 30,
  },
  frontHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallDevice ? 10 : 20,
  },
  titleContainer: {
    marginBottom: isSmallDevice ? 10 : 20,
  },
  mainTitle: {
    fontSize: isSmallDevice ? 70 : isTablet ? 70 : 70,
    color: "rgb(251, 245, 201)",
    marginBottom: isSmallDevice ? 4 : 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeDisplayFront: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: isSmallDevice ? 6 : 8,
    borderRadius: 20,
  },
  timeTextFront: {
    color: "white",
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "bold",
    marginLeft: 6,
  },
  userCardsContainer: {
    width: "100%",
    marginBottom: isSmallDevice ? 15 : 20,
  },
  userCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 10 : 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(122, 199, 12, 0.3)",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userTextContainer: {
    marginLeft: isSmallDevice ? 10 : 15,
  },
  userImage: {
    width: isSmallDevice ? 40 : 50,
    height: isSmallDevice ? 40 : 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  userName: {
    color: "white",
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "bold",
  },
  userRole: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: isSmallDevice ? 12 : 14,
  },
  pointsContainerRight: {
    alignItems: "flex-end",
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isSmallDevice ? 3 : 5,
  },
  pointsText: {
    color: "white",
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: "bold",
    marginLeft: 6,
  },
  iconImage: {
    width: isSmallDevice ? 18 : 22,
    height: isSmallDevice ? 18 : 22,
    tintColor: "white",
  },
  iconImageSmall: {
    width: isSmallDevice ? 16 : 20,
    height: isSmallDevice ? 16 : 20,
    tintColor: "white",
  },
  noUsersText: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 20,
    fontSize: isSmallDevice ? 20 : 25,
  },
  startButton: {
    paddingVertical: isSmallDevice ? 12 : 14,
    paddingHorizontal: isSmallDevice ? 24 : 32,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: isSmallDevice ? 10 : 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activeStartButton: {
    backgroundColor: "#2ecc71",
  },
  disabledStartButton: {
    backgroundColor: "#95a5a6",
    opacity: 0.7,
  },
  startButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: isSmallDevice ? 16 : 18,
    letterSpacing: 1,
  },
  flipButton: {
    backgroundColor: "#3498db",
    paddingVertical: isSmallDevice ? 12 : 14,
    paddingHorizontal: isSmallDevice ? 24 : 32,
    borderRadius: 25,
    marginTop: isSmallDevice ? 10 : 15,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  flipButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: isSmallDevice ? 14 : 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  showStatsContainer: {
    flexDirection: isSmallDevice ? "column" : "row",
    justifyContent: "space-between",
    marginBottom: isSmallDevice ? 15 : 20,
  },
  pointsKarmaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: isSmallDevice ? 10 : 15,
  },
  pointsContainer: {
    backgroundColor: "rgba(46, 204, 113, 0.2)",
    padding: isSmallDevice ? 8 : 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(46, 204, 113, 0.5)",
    marginRight: isSmallDevice ? 5 : 10,
  },
  badPointsContainer: {
    backgroundColor: "rgba(231, 76, 60, 0.2)",
    padding: isSmallDevice ? 8 : 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(231, 76, 60, 0.5)",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shopGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: isSmallDevice ? 15 : 20,
  },
  shopItem: {
    width: isSmallDevice ? "48%" : "30%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: isSmallDevice ? 10 : 15,
    padding: isSmallDevice ? 8 : 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledItem: {
    opacity: 0.3,
  },
  itemImage: {
    width: isSmallDevice ? 35 : 45,
    height: isSmallDevice ? 35 : 45,
    marginBottom: isSmallDevice ? 5 : 8,
  },
  itemName: {
    color: "white",
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: isSmallDevice ? 3 : 5,
  },
  itemPrice: {
    color: "#f1c40f",
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: "bold",
    textAlign: "center",
  },
   modalOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timerText: {
    fontSize: 20,
    color: "gray",
  },
  waitingText: {
  color: 'white',
  fontSize: 16,
  marginTop: 10,
  textAlign: 'center',
}

});