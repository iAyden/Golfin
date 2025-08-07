import React, { useEffect, useState } from "react";
import LocalLeaderboard from "../components/UserComponents/localLdrBoard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LocalLeaderboardStructure } from "@/components/UserComponents/localLdrBoard";
const LeaderBoardScreen = () => {
  const [userData, setUserData] = useState<any[]>([]);
  // Remove leaderboard from API for local only

useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const storedData = await AsyncStorage.getItem("latestUserCards");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("Datos cargados desde AsyncStorage:", parsedData);
          setUserData(parsedData);
        } else {
          console.log("No hay datos guardados en AsyncStorage.");
        }
      } catch (error) {
        console.error("Error leyendo AsyncStorage:", error);
      }
    };
    fetchUserCards();
  }, []);

  // Map userData to LocalLeaderboardStructure
  const mappedLeaderboard: LocalLeaderboardStructure[] = userData.map((user, idx) => ({
    position: idx + 1,
    username: user.username || user.name || `User${idx + 1}`,
    photoURL: user.photoURL && user.photoURL.startsWith('http')
      ? user.photoURL
      : (user.avatar && user.avatar.startsWith('http')
        ? user.avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name || `User${idx + 1}`)}`),
    wins: user.wins || user.points || 0,
    karma: user.karma || 0,
    traps: user.traps || 0,
    points: user.points || 0,
    birdies: user.birdies || 0,
    pars: user.pars || 0,
    bogeys: user.bogeys || 0,
  }));

return <LocalLeaderboard data={mappedLeaderboard} />;
};

export default LeaderBoardScreen;
