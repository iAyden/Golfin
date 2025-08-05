import axios from "axios";
const phoneURL = "http://192.168.0.22:8080";
const API_URL = `${phoneURL}/users/profile`; 
import { Platform } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
export const getProfile = async () => {
  console.log("dentro de getprofile")
  let token: string | null;
  const isWeb = Platform.OS === 'web';
        if (isWeb) {
            token = localStorage.getItem("jwt_token");
        } else {
            token = await AsyncStorage.getItem("jwt_token");
        }
    if (!token) throw new Error("Token no encontrado.");
    console.log("token: "+token);
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

