import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Switch, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import apiClient from "../services/api";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", profileImage: "" });
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

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Icon name="arrow-left" size={20} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#5A3D8A" />
        ) : (
          <>
            <Image source={{ uri: profile.profileImage || "https://via.placeholder.com/100" }} style={styles.profileImage} />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <Text style={styles.phone}>{profile.phone}</Text>
          </>
        )}
      </View>

      {/* Preferences */}
      <View style={styles.menuSection}>
        <MenuItem title="Favourite" icon="heart" />
        <MenuItem title="Language" icon="globe" />
        <View style={styles.menuItem}>
          <Icon name="moon-o" size={20} style={styles.icon} />
          <Text style={styles.menuText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} style={styles.switch} />
        </View>
      </View>
    </View>
  );
};

const MenuItem = ({ title, icon }) => (
  <View style={styles.menuItem}>
    {icon && <Icon name={icon} size={20} style={styles.icon} />}
    <Text style={styles.menuText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#5A3D8A", padding: 15 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "white" },
  profileContainer: { alignItems: "center", marginVertical: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  email: { fontSize: 16, color: "gray", marginTop: 5 },
  phone: { fontSize: 16, color: "gray", marginTop: 5 },
  menuSection: { marginTop: 20 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: "#ccc" },
  icon: { marginRight: 10, color: "#555" },
  menuText: { flex: 1, fontSize: 16 },
  switch: { marginLeft: "auto" },
});

export default ProfileScreen;
