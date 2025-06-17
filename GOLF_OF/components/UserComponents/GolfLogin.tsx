<<<<<<< HEAD
import { Try } from "expo-router/build/views/Try";
import React, { useState, useRef } from "react";
=======
import { Try } from 'expo-router/build/views/Try';
import React, { useState, useRef } from 'react';
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
>>>>>>> 99e73ae2e9383bd4aed84dc8b61b0ea0d306e9c5
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  Animated,
  Easing,
} from "react-native";

//Importar Zod Schema para login
export { loginSchema } from '../../schemas/AuthSchemas';

const GolfLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showFront, setShowFront] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
<<<<<<< HEAD

=======
  const {control, handleSubmit} = useForm();
>>>>>>> 99e73ae2e9383bd4aed84dc8b61b0ea0d306e9c5
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // const { control, handleSubmit, formState: { errors } } = useForm({
  //   resolver: yupResolver(loginSchema),
  // });

  const handleLogin = async () => {
<<<<<<< HEAD
    if (!email || !password) {
      Alert.alert("Error", "INGRESE SUS DATOS");
      return;
    }

    try {
      const response = await fetch("http://users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: password,
        }),
      });
      const data = await Response.json;
      const text = Response
        ? Alert.alert("Welcome", `Welcome ${email}`)
        : Alert.alert("Error", `error 505 Line 45`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo conectar al servidor. ");
    }
=======
    // if (!email || !password) {  Alert.alert('Error', 'INGRESE SUS DATOS');  return; }
    
    // try {
    //   const response  =await fetch('http://users/login',{
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({
    //       email, 
    //       password : password  
    //     }),
    //   });
    //   const data = await Response.json; 
    //   const text = (Response) ? Alert.alert('Welcome', `Welcome ${email}`) : Alert.alert('Error',`error 505 Line 45`);
    // } catch (error) {
    //   console.error(error);
    //   Alert.alert('Error', 'No se pudo conectar al servidor. ');
    // }   
>>>>>>> 99e73ae2e9383bd4aed84dc8b61b0ea0d306e9c5
  };

  const handleRegister = async () => {
<<<<<<< HEAD
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "LLENE LOS CAMPOS");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "PROGRAMACION EN PHP");
      return;
    }

    try {
      const response = await fetch("http://users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await response.json();
      const text = response
        ? Alert.alert("Welcome", `Welcome ${email}`)
        : Alert.alert("Error", `error 505 Line 63`);
    } catch (error) {
      console.error("ERROR AL REGISTRO: ", error);
      Alert.alert("error", "No se pudo conectat al lol ");
    }
=======
  //   if (!name || !email || !password || !confirmPassword) { Alert.alert('Error', 'LLENE LOS CAMPOS'); return; }

  //   if (password !== confirmPassword) {Alert.alert('Error', 'PROGRAMACION EN PHP'); return;}
    
  //   try {
  //     const response = await fetch('http://users/register', {
  //       method: 'POST',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify({
  //         name,
  //         email,
  //         password
  //         }),
  //         });
  //     const data = await response.json();
  //     const text = (response ) ? Alert.alert('Welcome', `Welcome ${email}`) : Alert.alert('Error', `error 505 Line 63`);
  //   } catch (error) {
  //     console.error('ERROR AL REGISTRO: ', error);
  //     Alert.alert('error', 'No se pudo conectat al lol ');
  //   }
>>>>>>> 99e73ae2e9383bd4aed84dc8b61b0ea0d306e9c5
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
  };

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

  return (
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
<<<<<<< HEAD

            <TextInput
=======
            
            {/* { <TextInput
>>>>>>> 99e73ae2e9383bd4aed84dc8b61b0ea0d306e9c5
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Passwod"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
<<<<<<< HEAD

            <TouchableOpacity style={styles.actionButton} onPress={handleLogin}>
=======
             } */}
            <Controller 
              control = {control}
              name= "email"
              render={() => <TextInput style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666" ></TextInput>}
            />
            <TouchableOpacity style={styles.actionButton} onPress={handleSubmit(handleLogin)}>
>>>>>>> 99e73ae2e9383bd4aed84dc8b61b0ea0d306e9c5
              <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={flipCard} style={styles.flipButton}>
              <Text style={styles.flipText}>Are you new? Sign up</Text>
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

            <TextInput
              style={styles.input}
              placeholder="Complete name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#666"
            />

            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#666"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Pasword"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Confirm Pasword"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#666"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={flipCard} style={styles.flipButton}>
              <Text style={styles.flipText}>Already registered? Sign in</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.footer}>MICRO RATONES</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  footer: {
    marginTop: 30,
    color: "#666",
    fontSize: 14,
  },
});

export default GolfLogin;
