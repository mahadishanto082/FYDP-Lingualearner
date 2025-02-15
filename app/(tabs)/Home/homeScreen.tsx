import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Animated as RNAnimated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated from "react-native-reanimated";

interface Post {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const fadeAnim = useState(new RNAnimated.Value(0))[0];
  const button1Anim = useState(new RNAnimated.Value(0))[0];
  const button2Anim = useState(new RNAnimated.Value(0))[0];

  useEffect(() => {
    RNAnimated.sequence([
      RNAnimated.timing(button1Anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      RNAnimated.timing(button2Anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
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
    <View style={styles.container}>
      {/* Top Right Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity
          onPress={() => router.push("./Profile")}
          style={styles.iconButton}
        >
          <Ionicons name="person-circle-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <Ionicons name="log-out-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Animated Buttons */}
      <View style={styles.centerContainer}>
        <Animated.View style={{ opacity: button1Anim }}>
          <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => router.push("./getStarted")}
            >
              <Ionicons name="play-circle" size={50} color="white" />
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: button1Anim }}>
          <LinearGradient
            colors={["#ff7e5f", "#feb47b"]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => router.push("../blog/blogDetails")}
            >
              <Ionicons name="book" size={50} color="white" />
              <Text style={styles.buttonText}>Read Blogs</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: button1Anim }}>
          <LinearGradient
            colors={["#43cea2", "#185a9d"]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => router.push("../blog/createBlog")}
            >
              <Ionicons name="pencil" size={50} color="white" />
              <Text style={styles.buttonText}>Write Blog</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{ opacity: button1Anim }}>
          <LinearGradient
            colors={["#43cea2", "#185a9d"]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => router.push("/(tabs)/Home/quizzes")}
            >
              <Ionicons name="help-circle" size={50} color="white" />
              <Text style={styles.buttonText}>Quizzes</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* New Dictionary Button */}
        <Animated.View style={{ opacity: button2Anim }}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.buttonContent}
              onPress={() => router.push("/(tabs)/Home/dictionary")}
            >
              <Ionicons name="book" size={50} color="white" />
              <Text style={styles.buttonText}>Dictionary</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f4f7" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* Top Right Buttons */
  topButtons: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 5,
    borderRadius: 10,
    zIndex: 10,
  },
  iconButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
  },

  /* Buttons */
  gradientButton: {
    borderRadius: 25,
    marginVertical: 10,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default HomeScreen;
