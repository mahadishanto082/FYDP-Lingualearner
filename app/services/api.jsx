// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Change this to your actual backend URL
// const API_URL = "http://localhost:5000";

// // ✅ Fetch user profile
// export const fetchUserProfile = async () => {
//   try {
//     const token = await AsyncStorage.getItem("userToken");
//     if (!token) throw new Error("No authentication token found");

//     const response = await fetch("https://localhost:5000/user/profile", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();
//     console.log("API Response Data:", data); // Debug API response

//     return data; // Ensure the function returns correct data
//   } catch (error) {
//     console.error("fetchUserProfile Error:", error);
//     return null; // Return null on failure
//   }
// };

// // ✅ Update user profile
// export const updateUserProfile = async (updatedData) => {
//   try {
//     const token = await AsyncStorage.getItem("userToken");

//     if (!token) {
//       console.error("User not authenticated (No Token Found)");
//       throw new Error("User not authenticated");
//     }

//     console.log("User Token:", token); // Debugging

//     const response = await axios.put(`${API_URL}/user/profile`, updatedData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error updating profile:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

import AsyncStorage from "@react-native-async-storage/async-storage";

// Use local network IP instead of "localhost" (update with actual IP)
const API_URL = "http://192.168.X.X:5000"; // Replace X.X with your actual IP

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No authentication token found");
      throw new Error("No authentication token found");
    }

    console.log("Stored Token:", token); // Debugging token issues

    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Check for successful response
    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("Fetch Error:", errorResponse); // Debugging API response error
      if (response.status === 401) {
        // Handle token expiry or invalidation here (e.g., prompt user to log in)
        throw new Error("Authentication failed. Please log in again.");
      }
      throw new Error("Failed to fetch profile");
    }

    // Parse and return the response data
    const responseData = await response.json();
    console.log("Fetched User Data:", responseData); // Debugging the fetched data
    return responseData;
  } catch (error) {
    console.error("fetchUserProfile Error:", error);
    return null; // Return null if an error occurs
  }
};

// Update user profile
export const updateUserProfile = async (updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No authentication token found");
      throw new Error("No authentication token found");
    }

    console.log("Updating Profile with:", updatedData); // Debugging

    const response = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("Update Error:", errorResponse); // Debugging API response error
      throw new Error("Failed to update profile");
    }

    // Parse and return the updated profile data
    const updatedProfile = await response.json();
    console.log("Updated Profile Data:", updatedProfile); // Debugging the updated profile
    return updatedProfile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
