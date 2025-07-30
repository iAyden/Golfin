import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  ImageBackground,
  useWindowDimensions,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

export default function CreateLobbyScreen() {
  const [fontsLoaded] = useFonts({
    gharison: require("../assets/fonts/gharison.ttf"),
  });

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 700;
  const hasAccount = true;
  const [lobbyCode, setLobbyCode] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [isReady, setIsReady] = useState(false);

  const joinScale = useRef(new Animated.Value(1)).current;
  const createScale = useRef(new Animated.Value(1)).current;

  console.log("isReady =", isReady);
  const onJoinPressIn = () => {
    Animated.spring(joinScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const onJoinPressOut = () => {
    Animated.spring(joinScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const onCreatePressIn = () => {
    Animated.spring(createScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const onCreatePressOut = () => {
    Animated.spring(createScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://192.168.0.15:8080/game");

    ws.current.onopen = () => {
      console.log("EL WEBSOCKET ESTA CONECTADO");
      setIsReady(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received:", data);
        if (data.payload) {
          setMessages((prev) => [...prev, JSON.stringify(data.payload)]);
        }
      } catch (err) {
        console.error("Error parseando mensaje:", err);
      }
    };

    ws.current.onerror = (err) => {
      console.error("Error WebSocket:", err);
      setIsReady(false);
    };

    ws.current.onclose = () => {
      console.log("WebSocket cerrado");
      setIsReady(false);
    };

    return () => {
      ws.current?.close();
      setIsReady(false);
    };
  }, []);

  const sendMessage = (data: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      Alert.alert("Error", "WebSocket no estabierto");
    }
  };

  const handleJoin = () => {
    if (!lobbyCode.trim()) {
      setError("POR FAVOR INGREESE EL CODIGO");
      return;
    }
    if (!userName.trim()) {
      setError("POR FAVOR INGREESE SU NOMBRE");
      return;
    }
    setError("");

    const data = {
      type: "joinParty",
      payload: { userName, code: lobbyCode.toUpperCase() },
    };

    sendMessage(data);
    Alert.alert("Éxito", `me uni con el codigo:  ${lobbyCode.toUpperCase()}`);
  };

  const handleCreate = () => {
    if (!userName.trim()) {
      setError("POR FAVOR INGREESE SU NOMBRE");
      return;
    }
    setError("");

    const data = {
      type: "createParty",
      payload: { userName },
    };

    sendMessage(data);
    Alert.alert("Éxito", "partida hehca");
  };

  return (
    <View
      style={[styles.bg, { paddingTop: isSmallScreen ? insets.top || 24 : 0 }]}
    >
      <ImageBackground
        source={require("../assets/images/BG IMG GLF.png")}
        style={styles.imageBg}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Golfin' Lobby</Text>
            <Text style={styles.subtitle}>Join or create a party!</Text>

            {/* Inputs y botón Join */}
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

              <Pressable
                onPress={handleJoin}
                onPressIn={() =>
                  Animated.spring(joinScale, {
                    toValue: 0.95,
                    useNativeDriver: true,
                  }).start()
                }
                onPressOut={() =>
                  Animated.spring(joinScale, {
                    toValue: 1,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                  }).start()
                }
                disabled={!true}
              >
                <Animated.View
                  style={[
                    styles.joinBtn,
                    { transform: [{ scale: joinScale }] },
                    !isReady && { opacity: 0.5 },
                  ]}
                >
                  <Text style={styles.btnText}>Join</Text>
                </Animated.View>
              </Pressable>
            </View>

            {/* Sección Create */}
            <View style={styles.sectionDivider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Don't have a code?</Text>
              <Pressable
                onPress={handleCreate}
                onPressIn={() =>
                  Animated.spring(createScale, {
                    toValue: 0.95,
                    useNativeDriver: true,
                  }).start()
                }
                onPressOut={() =>
                  Animated.spring(createScale, {
                    toValue: 1,
                    friction: 3,
                    tension: 40,
                    useNativeDriver: true,
                  }).start()
                }
              >
                <Animated.View
                  style={[
                    styles.createBtn,
                    { transform: [{ scale: createScale }] },
                  ]}
                >
                  <Text style={styles.btnText}>Create party</Text>
                </Animated.View>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(15, 76, 45, 0.98)",
  },
  imageBg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  card: {
    backgroundColor: "rgba(40,120,57,0.95)",
    borderRadius: 24,
    padding: 32,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgb(122, 199, 12)",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "rgb(251, 245, 201)",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "rgb(251, 245, 201)",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f0fff4",
    color: "#000000 ",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    width: "100%",
    borderWidth: 2,
    borderColor: "rgb(122, 199, 12)",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 2,
  },
  joinBtn: {
    backgroundColor: "rgb(142, 224, 0)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 4,
    width: "100%",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgb(122, 199, 12)",
  },
  createBtn: {
    backgroundColor: "rgb(229, 56, 56)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 4,
    width: "100%",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgb(211, 49, 49)",
  },
  btnText: {
    color: "#181818",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "rgb(122, 199, 12)",
    width: "100%",
    marginVertical: 16,
    opacity: 0.3,
    borderRadius: 1,
  },
  error: {
    color: "#ff5252",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
