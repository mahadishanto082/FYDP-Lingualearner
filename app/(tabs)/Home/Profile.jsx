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
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from "../../services/api";
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
  const [editingField, setEditingField] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserProfile();
      if (userData) setProfile(userData);
    } catch (error) {
      Alert.alert("Error", "Failed to load profile. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleImagePick = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Get the auth token
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
          const imageUrl = await uploadProfilePicture(uri, token); // Pass the token to the upload function
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

  const handleUpdateField = async (field, value) => {
    try {
      const updatedData = { ...profile, [field]: value };
      const updatedUser = await updateUserProfile(updatedData);
      setProfile(updatedUser);
      setEditingField("");
    } catch (error) {
      Alert.alert(
        "Update Failed",
        "Could not update profile. Please try again."
      );
    }
  };

  const DataField = ({ label, field, value }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editingField === field ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) =>
              setProfile((prev) => ({ ...prev, [field]: text }))
            }
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleUpdateField(field, value)}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.valueContainer}>
          <Text style={styles.fieldValue}>{value}</Text>
          <TouchableOpacity onPress={() => setEditingField(field)}>
            <Icon name="edit" size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

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

          <DataField label="Name" field="name" value={profile.name} />
          <DataField label="Email" field="email" value={profile.email} />
          <DataField
            label="Language"
            field="language"
            value={profile.language}
          />
          <DataField label="Level" field="level" value={profile.level} />
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
    flex: 1,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
});

export default ProfileScreen;
