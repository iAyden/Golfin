import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform  } from 'react-native';
const isWeb = Platform.OS === 'web';

const KEY = 'jwt_token';

export const saveToken = async (token: string): Promise<void> => {
    console.log("dentro de SaveToken "+token)
    if(isWeb){
        console.log("lo he guardado en web");
        localStorage.setItem(KEY, token);
        const savedTokenLS= localStorage.getItem(KEY);
        console.log("Savedtoken" +savedTokenLS);
    }
    else{
        console.log("lo he guardado en otro pedo");
        await AsyncStorage.setItem(KEY, token);
    }
};

export const getToken = async (): Promise<string | null> => {
    if(isWeb){
       return localStorage.getItem(KEY);
    }
    else{
        return await AsyncStorage.getItem(KEY);
    }
};

export const clearToken = async (): Promise<void> =>{
    if(isWeb){
        localStorage.removeItem(KEY);
    }
    else{
        await AsyncStorage.removeItem(KEY);
    }
};