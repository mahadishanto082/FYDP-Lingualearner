import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Change this to your actual backend URL
const API_URL = "http://localhost:5000";

// ✅ Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      console.error("User not authenticated (No Token Found)");
      throw new Error("User not authenticated");
    }

    console.log("User Token:", token); // Debugging

    const response = await axios.get(`${API_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Update user profile
export const updateUserProfile = async (updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      console.error("User not authenticated (No Token Found)");
      throw new Error("User not authenticated");
    }

    console.log("User Token:", token); // Debugging

    const response = await axios.put(`${API_URL}/user/profile`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error updating profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};
