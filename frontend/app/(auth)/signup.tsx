import { View, Text, Alert, Platform } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import SynapseLogo from "../../components/SynapseLogo";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
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

export default function Signup() {
  // Auth store action to log in after signup if needed
  const login = useAuthStore((s) => s.login);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] = useState(false);
const sendOtp = async () => {
  try {
    const response = await fetch(
  "https://mahima4569-synapse-backend.hf.space//otp/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showAlert(
  "OTP Sent",
  "Check your BMSCE email for the verification code."
);
      setOtpSent(true);
    } else {
      alert(data.detail);
    }
  } catch {
    showAlert(
  "Error",
  "Unable to send OTP. Please try again."
);
  }
};
const verifyOtp = async () => {
  try {
    const response = await fetch(
  "https://mahima4569-synapse-backend.hf.space//otp/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      }
    );

    const data = await response.json();

    if (data.verified) {
      showAlert(
  "Verified",
  "Your email has been successfully verified."
);
      setOtpVerified(true);
    } else {
      showAlert(
  "Verification Failed",
  "The OTP entered is incorrect."
);
    }
  } catch {
    alert("Verification failed");
  }
};
  const handleSignup = async () => {
    if (!otpVerified) {
  showAlert("Error", "Please verify your OTP first.");
  return;
}
    // Basic validation before hitting the API
    if (!name || !email || !password) {
      showAlert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://mahima4569-synapse-backend.hf.space//auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login after successful signup
        showAlert("Success", "Account created! Please log in.");
        router.replace("/(auth)/login");
      } else {
        // Show server-provided error message if available
        showAlert("Signup Failed", data.detail || "Something went wrong.");
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

      <Text style={GlobalStyles.heading2}>Create Account</Text>
      <Text style={GlobalStyles.body}>Start growing your knowledge garden 🌱</Text>

      {/* Name, email, password inputs */}
      <InputField
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <InputField 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <PrimaryButton
  label={otpVerified ? "Email Verified ✓" : "Send OTP"}
  onPress={sendOtp}
  disabled={otpVerified}
/>
{otpSent && !otpVerified && (
  <InputField
    placeholder="Enter OTP"
    value={otp}
    onChangeText={setOtp}
  />
)}
{otpSent && !otpVerified && (
  <PrimaryButton
    label="Verify OTP"
    onPress={verifyOtp}
  />
)}
{otpVerified && (
  <Text style={{ color: "green", marginVertical: 10 }}>
    ✅ 
  </Text>
)}
      <InputField 
        placeholder="Password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />

      {/* Disable buttons while request is in flight */}
     <PrimaryButton
  label={loading ? "Signing up..." : "Sign Up"}
  onPress={handleSignup}
  disabled={loading || !otpVerified}
/>
      <PrimaryButton
        label="Back to Login"
        variant="secondary"
        onPress={() => router.push("/(auth)/login")}
        disabled={loading}
      />
    </View>
  );
}