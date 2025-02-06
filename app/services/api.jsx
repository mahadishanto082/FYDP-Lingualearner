import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://your-backend-url/api"; // Change to your backend URL

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
};

const updateUserProfile = async (updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("User not authenticated");
  
    const response = await axios.put(`${API_URL}/user/profile`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw error;
  }
};
