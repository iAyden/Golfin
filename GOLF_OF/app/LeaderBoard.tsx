import React, { useEffect, useState } from 'react'; 
import { View, StyleSheet } from 'react-native';
import Leaderboard from '@/components/UserComponents/LeaderBoard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { LeaderboardStructure } from '@/components/UserComponents/LeaderBoard';
const LeaderBoardScreen = () => { 
  const [userData, setUserData] = useState([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardStructure[]>([]);
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
  useEffect(() => {
    axios.get('http://127.0.0.1:8080/users/leaderboard')
      .then(res => setLeaderboard(res.data))
      .catch(err => console.error(err));
  }, []);

  return <Leaderboard data={leaderboard} />;
};


export default LeaderBoardScreen;
