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

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use local network IP instead of "localhost" (Replace X.X with actual IP)
const API_URL = "http://localhost:5000"; // Update with your local IP

// Create Axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    console.error("API Error Response:", error.response.data);
    return error.response.data?.message || "An error occurred";
  } else if (error.request) {
    console.error("API No Response:", error.request);
    return "No response from server";
  } else {
    console.error("API Error:", error.message);
    return error.message;
  }
};

// ✅ Fetch user profile using Axios
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Stored Token:", token); // Debugging token issues

    const response = await apiClient.get("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetched User Data:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("fetchUserProfile Error:", handleApiError(error));
    return null;
  }
};

// ✅ Create a new blog post
export const createPost = async (token, postData) => {
  try {
    const response = await apiClient.post(
      "http://localhost:5000/posts",
      postData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // { message: string, post: object }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ✅ Fetch all blog posts
export const fetchAllPosts = async () => {
  try {
    const response = await apiClient.get("http://localhost:5000/posts");
    return response.data; // { posts: array }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ✅ Fetch a single blog post by ID
export const fetchPostDetails = async (postId) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data; // { post: object }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ✅ Update user profile using Axios
export const updateUserProfile = async (updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No authentication token found");

    console.log("Updating Profile with:", updatedData); // Debugging

    const response = await apiClient.put("/user/profile", updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Updated Profile Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", handleApiError(error));
    throw new Error(handleApiError(error));
  }
};
