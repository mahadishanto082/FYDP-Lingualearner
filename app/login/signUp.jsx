import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../services/api"; 

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "", name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name || !formData.phone) {
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await apiClient.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
      });
      setMessage("User registered successfully! Please login.");
      router.push("login/signIn");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animatable.View animation="fadeInUp" duration={1000} style={styles.container}>
      <Animatable.Text animation="fadeInDown" duration={1000} style={styles.appTitle}>
        The Lingua Learner App
      </Animatable.Text>

      <Animatable.View
        animation="zoomIn"
        duration={1000}
        style={[styles.signupContainer, isLargeScreen && styles.signupContainerLarge]}
      >
        <Text style={styles.signupTitle}>Sign Up</Text>

        <Animatable.View animation="fadeInLeft" duration={1500} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#BDBDBD"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#BDBDBD"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />
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
            placeholder="Password (Min 6 characters)"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password (Must match password)"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
        </Animatable.View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
          <Animatable.Text animation="bounceIn" duration={1000} style={styles.signupButtonText}>
            {loading ? "Loading..." : "Sign Up"}
          </Animatable.Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login/signIn")}>
            <Text style={styles.loginLink}>Login</Text>
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
  signupContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  signupContainerLarge: {
    maxWidth: 600,
    padding: 30,
  },
  signupTitle: {
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
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#7A81FF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  signupButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: {
    color: "#6E44A9",
    fontSize: 14,
  },
  loginLink: {
    color: "#6E44A9",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default SignupPage;