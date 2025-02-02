import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    if (email === "Shanto" && password === "123") {
      router.push("/dashboard");
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>The Lingua Learner App</Text>

      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#BDBDBD"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
          <FontAwesome5 name="google" size={20} color="black" />
          <Text style={[styles.socialButtonText, styles.googleButtonText]}>
            Login with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
          <FontAwesome5 name="facebook" size={20} color="white" />
          <Text style={[styles.socialButtonText, styles.facebookButtonText]}>
            Login with Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    width: "100%",
    backgroundColor: "#F1F1F1",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6E44A9",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ECE2F0",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#000",
  },
  forgotPassword: {
    color: "#6E44A9",
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#8B5FBF",
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
  orText: {
    color: "#6E44A9",
    fontSize: 14,
    marginBottom: 15,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  googleButtonText: {
    color: "#000",
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  facebookButton: {
    backgroundColor: "#4267B2",
  },
  facebookButtonText: {
    color: "#FFF",
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Login;
