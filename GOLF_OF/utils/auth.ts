import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
const isWeb = Platform.OS === 'web';

export const checkAuthToken = async (): Promise<boolean> => {
    try{
        console.log("dentro de checkauthtoken");
       
        const token = localStorage.getItem("jwt_token");
        
        
        console.log("token "+token)
        if(!token) return false;
        
        const res = await fetch ("http://127.0.0.1:8080/auth/validate",{
            method: "GET",
            headers: {Authorization: `Bearer ${token}`, 
        },
        
    });
    console.log("todo mandado");
    return true;
    
    }catch(err){
        console.error("Error al verificar el token:", err);
        return false;
    }
};