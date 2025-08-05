import { Try } from "expo-router/build/views/Try";
//import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
//import { API_URL } from '@env';
import { useNavigation } from "@react-navigation/native";
import { makeRedirectUri } from "expo-auth-session";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Animated,
  Alert,
  Easing,
  ImageBackground,
} from "react-native";
import * as AuthSession from "expo-auth-session";

import * as WebBrowser from "expo-web-browser";
//Importar función para autentificar token
import { checkAuthToken } from "@/utils/auth";
import { useRouter } from "expo-router";
//Importar metodos para majear JWTs
import { saveToken, getToken, clearToken } from "../../utils/jwtStorage";

//Importar componente del boton de Google Singin
import GoogleButton from "../VisualComponents/GoogleButton";
//Google Signup
import * as Google from "expo-auth-session/providers/google";

//Importar Zod Schema para login
import { loginSchema, loginSchemaType } from "../../schemas/AuthSchemas";
//Importar Zod Schema para SignUp
import { signupSchema, signupSchemaType } from "../../schemas/AuthSchemas";
import { Platform } from "react-native";
import Constants from "expo-constants";

const GolfLogin = () => {
  const router = useRouter();

  const [isCheckingAuth, setisCheckingAuth] = useState(true);
  const [showFront, setShowFront] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [errorMsg, setErrorMsg] = useState("");
  const navigation = useNavigation();
  const redirectUri = Platform.OS === "web"

  
  ? `https://bb599f5d352b.ngrok-free.app/google-popup.html`
  : makeRedirectUri({ native: "golfin://redirect", useProxy: true as any, 
  });
  console.log("Redirect URI móvil:", redirectUri);
  const isWeb = Platform.OS === 'web';
  const phoneURL = "http://192.168.0.22:8080";
  useEffect(() => {
    console.log("use efect");

    const verifyToken = async () => {
      const isLoggedIn = await checkAuthToken();
      console.log("isloggedin " + isLoggedIn);
      if (isLoggedIn) {
        console.log("usuario logeado");
        window.location.href = "/profileStats";
      } else {
        setisCheckingAuth(false);
      }
    };
    verifyToken();
  }, []);

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });
  const {
    control: signupControl,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: signupErrors },
  } = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "467124897071-etfu4to0fh6i2rcpgvol7f15m5cdnthj.apps.googleusercontent.com",
    scopes: ["openid", "email", "profile"],
    responseType: "id_token",
    redirectUri,
  });
  
  useEffect(() => {
    console.log("Redirect URI móvil:", redirectUri);

    if (Platform.OS === "web") {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.id_token) {
          const id_token = event.data.id_token;
          console.log("Token recibido del popup:", id_token);
  
          fetch(`${phoneURL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.token) {
                saveToken(data.token);
                if(isWeb){
                window.location.href = "/profileStats";} 
                else{
                  const router = useRouter();
                  router.push("/profileStats");
                }
              }
            })
            .catch((err) => console.error("Error en el fetch:", err));
        }
      };
  
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" && response?.type === "success") {
      const { id_token } = response.params;
      console.log("Token recibido en móvil:", id_token);
  
      fetch(`${phoneURL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            saveToken(data.token);
            window.location.href = "/profileStats";
          }
        })
        .catch((err) => console.error("Error en el fetch:", err));
    }
  }, [response]);
  
  const handleGoogleLogin = async () => {
    await promptAsync();
  };

  const handleLogin = async (formData: loginSchemaType) => {
    setErrorMsg("");
    console.log(formData.email);
    console.log(formData.password);
    if (!formData.email || !formData.password) {
      console.log("error email y password no encontrados");
      return;
    }
    try {
      Alert.alert("Bienvenido amigo {$email}");
      const response = await fetch(`${phoneURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        setErrorMsg(errorBody.error || "Error desconocido");
        console.log(errorMsg);
      } else {
        //REDIRIGIR AL perfil
        console.log("perfil");
        const data = await response.json();
        const token = data.token;
        console.log("token guardado del login" + token);
        saveToken(token);  
        if(isWeb){
          window.location.href = "/profileStats"; 
        
        if (typeof window !== "undefined" && window.location) {
          window.location.href = "/profileStats";
        }}
        else{
          const router = useRouter();
          router.push("/profileStats");
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("No se pudo conectar con el servidor");
      Alert.alert("error,", "no se pudo conectar con el servidor");
    }
  };

  const handleRegister = async (formData: signupSchemaType) => {
    setErrorMsg("");
    console.log("username" + formData.username);
    console.log("email" + formData.email);
    console.log("password" + formData.password);
    console.log("confirm_password" + formData.confirm_password);
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirm_password
    ) {
      console.log("error faltan datos del signup");
      return;
    }
    try {
      const response = await fetch(`${phoneURL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.confirm_password,
        }),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        setErrorMsg(errorBody.error || "Error desconocido");
        console.log(errorMsg);
      } else {
        //REDIRIGIR AL perfil
        console.log("perfil");
        const data = await response.json();
        const token = data.token;
        console.log("token guardado del signup" + token);
        saveToken(token);
        if(isWeb){
          window.location.href = "/profileStats";} 
          else{
            const router = useRouter();
            router.push("/profileStats");
          }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("error fallo signup");
    }
  };

  // ANIMACION DE TAILDWIND NO LE MUEVAN
  const flipCard = () => {
    Animated.timing(flipAnimation, {
      toValue: showFront ? 180 : 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setShowFront(!showFront);
    });
    setErrorMsg("");
  };

  // DEFINIMOS EL TIPO PARA LOS ITEMS DEL MENU
  type MenuItem = {
    id: string;
    title: string;
    icon: React.ComponentProps<typeof FontAwesome>["name"];
  };

  // DATOS DEL MENU CORTO AQUI MODIFICAMOS LOS REDIRECCIONAMIENTOS
  const MENU_ITEMS: MenuItem[] = [{ id: "/", title: "Home", icon: "home" }];

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <ImageBackground
      source={require("@/assets/images/BG IMG GLF.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>🏌️ Golf Pro Login 🏌️‍♂️</Text>

          <View style={styles.cardContainer}>
            {/* PARTE DEL FRENTE DE LA CARTA LOGIN*/}
            <Animated.View
              style={[
                styles.cardFace,
                styles.cardFront,
                frontAnimatedStyle,
                { display: showFront ? "flex" : "none" }, //  NO LE MUEVAN POR FAVOR
              ]}
            >
              <Image
                source={require("@/assets/images/golf.png")}
                style={styles.logo}
              />
              <Text style={styles.cardTitle}>Hi again</Text>
              <Controller
                control={loginControl}
                name="email"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#666"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {loginErrors.email && (
                <Text style={{ color: "red" }}>
                  {loginErrors.email.message}
                </Text>
              )}

              <Controller
                control={loginControl}
                name="password"
                render={({ field }) => (
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#666"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {loginErrors.password && (
                <Text style={{ color: "red" }}>
                  {loginErrors.password.message}
                </Text>
              )}
              {errorMsg && <Text style={{ color: "red" }}>{errorMsg}</Text>}

              <GoogleButton onPress={handleGoogleLogin} />

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleLoginSubmit(handleLogin)}
              >
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={flipCard} style={styles.flipButton}>
                <Text style={styles.flipText}>Are you new? Sign up</Text>
              </TouchableOpacity>
              {/* Exit to Main Menu Button */}
              <TouchableOpacity
                style={styles.exitButton}
                onPress={() => router.replace("/")}
              >
                <FontAwesome name="sign-out" size={18} color="#2E7D32" />
                <Text style={styles.exitButtonText}>Exit to Main Menu</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* PARTE DE ATRAS DE LA CARTA REGISTER */}
            <Animated.View
              style={[
                styles.cardFace,
                styles.backFace,
                backAnimatedStyle,
                { display: showFront ? "none" : "flex" }, // NO LE MUEVAN POR FAVOR
              ]}
            >
              <Image
                source={require("@/assets/images/register.png")}
                style={styles.logo}
              />
              <Text style={styles.cardTitle}>New player</Text>

              <Controller
                control={signupControl}
                name="username"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#666"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {signupErrors.username && (
                <Text style={{ color: "red" }}>
                  {signupErrors.username.message}
                </Text>
              )}

              <Controller
                control={signupControl}
                name="email"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    keyboardType="email-address"
                    placeholderTextColor="#666"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {signupErrors.email && (
                <Text style={{ color: "red" }}>
                  {signupErrors.email.message}
                </Text>
              )}
              <Controller
                control={signupControl}
                name="password"
                render={({ field }) => (
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#666"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {signupErrors.password && (
                <Text style={{ color: "red" }}>
                  {signupErrors.password.message}
                </Text>
              )}

              <Controller
                control={signupControl}
                name="confirm_password"
                render={({ field }) => (
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Confirm Password"
                      secureTextEntry={!showConfirmPassword}
                      placeholderTextColor="#666"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Text>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {signupErrors.confirm_password && (
                <Text style={{ color: "red" }}>
                  {signupErrors.confirm_password.message}
                </Text>
              )}
              {errorMsg && <Text style={{ color: "red" }}>{errorMsg}</Text>}
              <GoogleButton
                onPress={handleGoogleLogin}
                text="Sign up with Google"
              />
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleRegisterSubmit(handleRegister)}
              >
                <Text style={styles.buttonText}>Sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={flipCard} style={styles.flipButton}>
                <Text style={styles.flipText}>Already registered? Sign in</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 30,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 400,
    height: 700,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardFace: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backfaceVisibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
  },
  cardFront: {
    backgroundColor: "#e8f5e9",
  },
  backFace: {
    backgroundColor: "#c8e6c9",
    transform: [{ rotateY: "180deg" }],
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 25,
    textAlign: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#81c784",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "white",
    fontSize: 16,
    color: "#333",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    padding: 10,
  },
  actionButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  flipButton: {
    marginTop: 10,
    padding: 8,
  },
  flipText: {
    color: "#1b5e20",
    fontSize: 16,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  exitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  exitButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  footer: {
    marginTop: 30,
    color: "#666",
    fontSize: 14,
  },
});

export default GolfLogin;
