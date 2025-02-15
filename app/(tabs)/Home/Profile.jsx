import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { fetchUserProfile, uploadProfilePicture } from "../../services/api";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    language: "",
    profileImage: "",
    level: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const userData = await fetchUserProfile();
      console.log("Fetched Profile Data:", userData); // Log the fetched data
      if (userData) {
        setProfile(userData);
      } else {
        Alert.alert("Error", "Could not fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImagePick = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Not authenticated. Please log in again.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const { uri } = result.assets[0];
        try {
          setLoading(true);
          const imageUrl = await uploadProfilePicture(uri, token);
          setProfile((prev) => ({ ...prev, profileImage: imageUrl }));
        } catch (error) {
          Alert.alert(
            "Upload Failed",
            "Could not upload image. Please try again."
          );
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#5A3D8A" />
      ) : (
        <View style={styles.profileContainer}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.profileImageContainer}
          >
            <Image
              source={{
                uri: profile.profileImage || "https://via.placeholder.com/100",
              }}
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Icon name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name</Text>
            <Text style={styles.fieldValue}>
              {profile.name ? profile.name : "Not available"}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={styles.fieldValue}>{profile.email}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Language</Text>
            <Text style={styles.fieldValue}>
              {profile.language ? profile.language : "Not specified"}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Level</Text>
            <Text style={styles.fieldValue}>
              {profile.level ? profile.level : "Not specified"}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  profileContainer: {
    padding: 20,
  },
  profileImageContainer: {
    alignSelf: "center",
    marginBottom: 30,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  fieldValue: {
    fontSize: 16,
  },
});

export default ProfileScreen;
