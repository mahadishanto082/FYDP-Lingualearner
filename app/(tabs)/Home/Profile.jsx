import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import apiClient from "../../services/api";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/user/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const { uri } = result;

      // Upload image to server or cloud service here
      const imageUrl = await uploadImageToServer(uri);

      // Save image URL in the database or user profile
      saveImageUrlToDatabase(imageUrl);

      // Update profile with the selected image
      setProfile((prev) => ({ ...prev, profileImage: uri }));
    }
  };

  // Function to upload image to server (replace with your API)
  const uploadImageToServer = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg", // Adjust if you're uploading PNG or another image type
      name: "image.jpg", // You can use the actual file name
    });

    const response = await fetch("YOUR_SERVER_URL/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.imageUrl; // Assuming the server returns the URL of the uploaded image
    }

    throw new Error("Image upload failed");
  };

  // Save the image URL in your database (replace with actual API call)
  const saveImageUrlToDatabase = async (imageUrl) => {
    const response = await fetch("YOUR_SERVER_URL/save-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Image URL saved successfully");
    } else {
      console.error("Failed to save image URL");
    }
  };

  const handleLanguageChange = () => {
    setSelectedLanguage((prev) => (prev === "English" ? "Spanish" : "English"));
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#5A3D8A" />
        ) : (
          <>
            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.profileImageFrame}
            >
              <Image
                source={{
                  uri:
                    profile.profileImage || "https://via.placeholder.com/100",
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.username}>{profile.username}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <Text style={styles.phone}>{profile.phone}</Text>
          </>
        )}
      </View>

      {/* Preferences */}
      <View style={styles.menuSection}>
        <View style={styles.menuItem}>
          <Icon name="globe" size={20} style={styles.icon} />
          <Text style={styles.menuText}>Language: {selectedLanguage}</Text>
          <TouchableOpacity
            style={styles.changeLangButton}
            onPress={handleLanguageChange}
          >
            <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuItem}>
          <Icon name="moon-o" size={20} style={styles.icon} />
          <Text style={styles.menuText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            style={styles.switch}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#5A3D8A",
    padding: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "white" },
  profileContainer: { alignItems: "center", marginVertical: 20 },
  profileImageFrame: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#5A3D8A",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileImage: { width: 110, height: 110, borderRadius: 55 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  username: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  email: { fontSize: 16, color: "gray", marginTop: 5 },
  phone: { fontSize: 16, color: "gray", marginTop: 5 },
  menuSection: { marginTop: 20 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  icon: { marginRight: 10, color: "#555" },
  menuText: { flex: 1, fontSize: 16 },
  switch: { marginLeft: "auto" },
  changeLangButton: {
    backgroundColor: "#5A3D8A",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: { color: "white", fontSize: 14 },
});

export default ProfileScreen;
