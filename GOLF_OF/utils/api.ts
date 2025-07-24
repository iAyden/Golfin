import axios from "axios";
const API_URL = "http://127.0.0.1:8080/users/profile"; 
export const getProfile = async () => {
  console.log("dentro de getprofile")
    const token = localStorage.getItem("jwt_token");
    if (!token) throw new Error("Token no encontrado.");
    console.log("token: "+token);
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
