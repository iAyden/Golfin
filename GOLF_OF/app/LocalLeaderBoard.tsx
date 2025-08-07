import React, { useEffect, useState } from "react";
import Leaderboard from "@/components/UserComponents/localLdrBoard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LocalLeaderboardStructure } from "@/components/UserComponents/localLdrBoard";
const LeaderBoardScreen = () => {
  const [userData, setUserData] = useState([]);
  const [leaderboard, setLeaderboard] = useState<LocalLeaderboardStructure[]>(
    []
  );

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

  console.log("Se imprime esto por el local storage", userData);
  useEffect(() => {
    axios
      .get(
        "https://vehicle-etc-bare-proceeds.trycloudflare.com/users/leaderboard"
      )
      .then((res) => setLeaderboard(res.data))
      .catch((err) => console.error(err));
  }, []);

  return <Leaderboard data={leaderboard} />;
};

export default LeaderBoardScreen;
