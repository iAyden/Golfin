import React, { useEffect, useState } from 'react'; 
import { View, StyleSheet } from 'react-native';
import Leaderboard from '@/components/UserComponents/LeaderBoard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeaderBoardScreen = () => { 
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const storedData = await AsyncStorage.getItem('latestUserCards');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log('Datos cargados desde AsyncStorage:', parsedData);
          setUserData(parsedData);
        } else {
          console.log('No hay datos guardados en AsyncStorage.');
        }
      } catch (error) {
        console.error('Error leyendo AsyncStorage:', error);
      }
    };

    fetchUserCards();
  }, []);

  console.log("Se imprime esto por el local storage", userData);

  return (
    <View> 
      <Leaderboard/>
    </View>
  );
};

export default LeaderBoardScreen;
