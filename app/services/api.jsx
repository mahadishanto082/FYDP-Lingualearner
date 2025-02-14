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

const API_URL = "http://localhost:5000"; // Use this for Android Emulator
// const API_URL = "http://192.168.X.X:5000"; // Use this for real devices

// ✅ Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("API Response Data:", data); // Debug API response

    return data;
  } catch (error) {
    console.error("fetchUserProfile Error:", error);
    return null;
  }
};

// ✅ Update user profile
export const updateUserProfile = async (updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

