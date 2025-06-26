import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = typeof window !== 'undefined';

const KEY = 'auth_token';

export const saveToken = async (token: string): Promise<void> => {
    if(isWeb){
        localStorage.setItem(KEY, token);
    }
    else{
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