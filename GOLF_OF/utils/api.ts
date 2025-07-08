import axios from "axios";
import { checkAuthToken } from "./auth";
const API_URL = "http://127.0.0.1:8080/users/profile"; 
export const getProfile = async () => {
    const token = localStorage.getItem("jwt_token");
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
