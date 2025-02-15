import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { registerUser } from "../services/api";

const { width } = Dimensions.get("window");
const isLargeScreen = width > 768;

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Add AsyncStorage error checking
  const checkAsyncStorage = async () => {
    try {
      // Try to write and read a test value
      await AsyncStorage.setItem('@storage_test', 'test_value');
      const testValue = await AsyncStorage.getItem('@storage_test');
      
      if (testValue !== 'test_value') {
        setMessage('AsyncStorage is not working properly');
        return false;
      }
      
      // Clean up test value
      await AsyncStorage.removeItem('@storage_test');
      return true;
    } catch (error) {
      console.error('AsyncStorage Error:', error);
      setMessage('Error accessing device storage: ' + error.message);
      return false;
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      console.log('Image picker result:', result);

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        console.log('Selected image:', selectedImage);

        // Check file size
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        const fileSize = blob.size;
        
        if (fileSize > 5 * 1024 * 1024) { // 5MB limit
          setMessage('Image size must be less than 5MB');
          return;
        }

        // Get file extension from URI
        const extension = selectedImage.uri.split('.').pop();
        
        setFormData(prev => ({
          ...prev,
          profileImage: {
            uri: selectedImage.uri,
            type: `image/${extension}`,
            name: `profile-image.${extension}`,
          }
        }));
        
        console.log('Updated form data with image:', {
          uri: selectedImage.uri,
          type: `image/${extension}`,
          name: `profile-image.${extension}`,
        });

        setMessage(''); // Clear any previous error messages
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setMessage('Error selecting image. Please try again.');
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    try {
<<<<<<< HEAD
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone,
        }),
      });
      setMessage("User registered successfully! Please login.");
      router.push("../(tabs)/index1");
=======
      console.log('Starting signup with form data:', formData);

      if (
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.name
      ) {
        setMessage("All fields are required except profile image.");
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

      // Try to store user email temporarily
      try {
        await AsyncStorage.setItem('@last_signup_email', formData.email);
      } catch (storageError) {
        console.error('Failed to store email in AsyncStorage:', storageError);
        // Continue with signup despite AsyncStorage error
      }

      const response = await registerUser(formData);
      console.log('Registration successful:', response);
      
      setMessage("Registration successful!");
      
      // Navigate to dashboard after successful registration
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1000);

      // Clear stored email on successful signup
      try {
        await AsyncStorage.removeItem('@last_signup_email');
      } catch (storageError) {
        console.error('Failed to clear email from AsyncStorage:', storageError);
      }
>>>>>>> 5fe4bdb506750dc4349dd5e9e48a26e1e53d3da6
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMessage);
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
          styles.signupContainer,
          isLargeScreen && styles.signupContainerLarge,
        ]}
      >
        <Text style={styles.signupTitle}>Sign Up</Text>

        <Animatable.View
          animation="fadeInLeft"
          duration={1500}
          style={styles.inputContainer}
        >
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#BDBDBD"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
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
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password (Must match password)"
            placeholderTextColor="#BDBDBD"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
          />
            <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
            {formData.profileImage ? (
              <Image
                source={{ uri: formData.profileImage.uri }}
                style={styles.previewImage}
              />
            ) : (
              <Text style={styles.imageUploadText}>Upload Profile Picture</Text>
            )}
          </TouchableOpacity>
        </Animatable.View>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.signupButton}
          onPress={handleSignup}
          disabled={loading}
        >
          <Animatable.Text
            animation="bounceIn"
            duration={1000}
            style={styles.signupButtonText}
          >
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
  imageUploadButton: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  imageUploadText: {
    color: "#BDBDBD",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default SignupPage;
