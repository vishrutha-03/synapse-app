import { View, Text, Alert, Platform } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import SynapseLogo from "@/components/SynapseLogo";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { GlobalStyles } from "../../theme/theme";
import { useAuthStore } from "../../store/useAuthStore";

// Cross-platform alert helper (web doesn't support Alert.alert)
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function Login() {
  // Pulls the login action to store token + username globally
  const login = useAuthStore((s) => s.login);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Basic validation before hitting the API
    if (!email || !password) {
      showAlert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token + username to global store, then navigate home
        login(data.access_token, data.username);
        router.replace("/(tabs)/home");
      } else {
        // Show server-provided error message if available
        showAlert("Login Failed", data.detail || "Invalid credentials.");
      }
    } catch (error) {
      // Likely a connection issue (server down, wrong URL, etc.)
      showAlert("Network Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[GlobalStyles.screen, { padding: 24, justifyContent: "center" }]}>
      <SynapseLogo />

      <Text style={GlobalStyles.heading2}>Welcome Back</Text>
      <Text style={GlobalStyles.body}>Log into Synapse to continue 🌿</Text>

      {/* Email and password inputs */}
      <InputField 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <InputField 
        placeholder="Password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      {/* Disable buttons while request is in flight */}
      <PrimaryButton
        label={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
      <PrimaryButton
        label="Go to Signup"
        variant="secondary"
        onPress={() => router.push("/(auth)/signup")}
        disabled={loading}
      />
    </View>
  );
}