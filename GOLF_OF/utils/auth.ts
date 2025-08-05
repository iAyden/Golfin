import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
const isWeb = Platform.OS === 'web';
const phoneURL = "http://192.168.0.22:8080";
export const checkAuthToken = async (): Promise<boolean> => {
    try {
        console.log("Dentro de checkAuthToken");

        let token: string | null;

        if (isWeb) {
            token = localStorage.getItem("jwt_token");
        } else {
            token = await AsyncStorage.getItem("jwt_token");
        }

        console.log("Token:", token);

        if (!token) return false;

        //const res = await fetch("http://127.0.0.1:8080/auth/validate", { normal pc
        const res = await fetch(`${phoneURL}/auth/validate`, {    
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        console.log("Request enviada");

        return res.ok;
    } catch (err) {
        console.error("Error al verificar el token:", err);
        return false;
    }
};
