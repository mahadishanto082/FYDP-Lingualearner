import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const UserProfile = ({ user }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: user.image }} style={styles.image} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.info}>{user.email}</Text>
        <Text style={styles.info}>{user.phone}</Text>
      </View>
    </View>
  );
};

export default function ProfilePage() {
  const user = {
    image: "https://via.placeholder.com/100", // Replace with actual user image URL
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  };

  return <UserProfile user={user} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: "gray",
  },
});
