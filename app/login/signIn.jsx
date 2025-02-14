import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../services/api";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("Both email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      console.log("Login Successful:", data);
      await AsyncStorage.setItem("token", data.token);
      router.replace("/Home/homeScreen");
    } catch (error) {
      console.log("Login Error:", error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={1000}
      style={styles.container}
    >
      <Animatable.Text
        animation="fadeInDown"
        duration={1000}
        style={styles.appTitle}
      >
        The Lingua Learner App
      </Animatable.Text>

      <Animatable.View
        animation="zoomIn"
        duration={1000}
        style={[
          styles.loginContainer,
          isLargeScreen && styles.loginContainerLarge,
        ]}
      >
        <Text style={styles.loginTitle}>Login</Text>

        <Animatable.View
          animation="fadeInLeft"
          duration={1500}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#BDBDBD"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />
        </Animatable.View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Animatable.Text
            animation="bounceIn"
            duration={1000}
            style={styles.loginButtonText}
          >
            {loading ? "Loading..." : "Login"}
          </Animatable.Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login/signUp")}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#D9D2E9",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5A3D8A",
    marginBottom: 30,
  },
  loginContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  loginContainerLarge: {
    maxWidth: 600,
    padding: 30,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6E44A9",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#000",
  },
  message: {
    color: "#FF0000",
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#7A81FF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  signupText: {
    color: "#6E44A9",
    fontSize: 14,
  },
  signupLink: {
    color: "#6E44A9",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default LoginPage;
