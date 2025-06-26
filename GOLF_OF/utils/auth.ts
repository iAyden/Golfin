import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkAuthToken = async (): Promise<boolean> => {
    try{
        const token = await AsyncStorage.getItem("jwt_token");
        if(!token) return false;
        
        const res = await fetch ("http://127.0.0.1:8080/auth/validate",{
            method: "GET",
            headers: {Authorization: `Bearer ${token}`, 
        },
    });
    return res.ok;
    
    }catch(err){
        console.error("Error al verificar el token:", err);
        return false;
    }
};