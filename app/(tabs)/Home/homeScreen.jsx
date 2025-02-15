/**
 * @file homeScreen.jsx
 * @description Home screen component for the Lingua Learner app.
 * @copyright 2025 Lingua Learner
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const buttons = [
  {
    label: "Get Started",
    icon: "play-circle",
    path: "./getStarted",
    colors: ["#9b6df7", "#6c3dd6"],
  },
  {
    label: "Read Blogs",
    icon: "book",
    path: "../blog/blogDetails",
    colors: ["#ff45a9", "#d81b60"],
  },
  {
    label: "Write Blog",
    icon: "pencil",
    path: "../blog/createBlog",
    colors: ["#26de81", "#20bf6b"],
  },
  {
    label: "Quizzes",
    icon: "help-circle",
    path: "./quizzes",
    colors: ["#00d2ff", "#00b3e6"],
  },
];

const HomeScreen = () => {
  const router = useRouter();
  const [buttonAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      router.replace("/login/signIn");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topButtons}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
        <View style={styles.rightButtons}>
          <IconButton
            onPress={() => router.push("./Profile")}
            icon="person-circle-outline"
          />
          <IconButton onPress={handleLogout} icon="log-out-outline" />
        </View>
      </View>

      <View style={styles.centerContainer}>
        {buttons.map((button, index) => (
          <AnimatedButton
            key={index}
            button={button}
            buttonAnim={buttonAnim}
            onPress={() => router.push(button.path)}
          />
        ))}
      </View>

      <Text style={styles.footerText}>© 2025 Lingua Learner. All rights reserved.</Text>
    </ScrollView>
  );
};

const IconButton = ({ onPress, icon }) => (
  <TouchableOpacity onPress={onPress} style={styles.iconButton}>
    <Ionicons name={icon} size={28} color="black" />
  </TouchableOpacity>
);

const AnimatedButton = ({ button, buttonAnim, onPress }) => (
  <Animated.View style={{ opacity: buttonAnim, marginVertical: 8, width: '100%' }}>
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={button.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardButton}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>{button.label}</Text>
          <Ionicons name={button.icon} size={24} color="white" style={styles.buttonIcon} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f0f4f7"
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  rightButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
  },
  cardButton: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: '100%',
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  }
});

export default HomeScreen;