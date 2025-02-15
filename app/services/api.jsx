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

<<<<<<< HEAD
const API_URL = "http://localhost:5000"; // Use this for Android Emulator
// const API_URL = "http://192.168.X.X:5000"; // Use this for real devices
=======
// Change this to your actual backend URL
const API_URL = "http://192.168.0.125:5000"; // Updated to match your IP address
>>>>>>> 5fe4bdb506750dc4349dd5e9e48a26e1e53d3da6

const apiClient = axios.create({
  baseURL: API_URL,
});

// Register new user
export const registerUser = async (userData) => {
  try {
<<<<<<< HEAD
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
=======
    console.log('Starting registration with data:', userData);
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    if (userData.profileImage) {
      console.log('Processing profile image:', userData.profileImage);
      const imageUri = userData.profileImage.uri;
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('profileImage', {
        uri: imageUri,
        type,
        name: filename,
      });

      console.log('Added image to form data:', {
        uri: imageUri,
        type,
        name: filename
      });
    }

    console.log('Sending registration request with form data');
    const response = await apiClient.post('/register', formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        return formData; // Prevent axios from trying to transform FormData
      },
    });

    console.log('Registration response:', response.data);

    // If registration is successful, store the token
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      
      // If the image URL is relative, make it absolute
      if (response.data.user.image && response.data.user.image.startsWith('/')) {
        response.data.user.image = `${API_URL}${response.data.user.image}`;
      }
    }

    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
>>>>>>> 5fe4bdb506750dc4349dd5e9e48a26e1e53d3da6
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await apiClient.get('/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If the image URL is relative, make it absolute
    if (response.data.image && response.data.image.startsWith('/')) {
      response.data.image = `${API_URL}${response.data.image}`;
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Add other API functions here
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      
      // If the image URL is relative, make it absolute
      if (response.data.user.image && response.data.user.image.startsWith('/')) {
        response.data.user.image = `${API_URL}${response.data.user.image}`;
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (updatedData) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No authentication token found");

<<<<<<< HEAD
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
=======
    if (!token) {
      console.error("User not authenticated (No Token Found)");
      throw new Error("User not authenticated");
    }

    console.log("User Token:", token); // Debugging

    const response = await apiClient.put('/user/profile', updatedData, {
>>>>>>> 5fe4bdb506750dc4349dd5e9e48a26e1e53d3da6
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

<<<<<<< HEAD
=======
// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
      console.error("User not authenticated (No Token Found)");
      throw new Error("User not authenticated");
    }

    console.log("User Token:", token); // Debugging

    const response = await apiClient.get('/user/profile', {
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
>>>>>>> 5fe4bdb506750dc4349dd5e9e48a26e1e53d3da6
