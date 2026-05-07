import { View, Text } from "react-native";
import { router } from "expo-router";
import SynapseLogo from "../../components/SynapseLogo";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { GlobalStyles } from "../../theme/theme";
import { useAuthStore } from "../../store/useAuthStore";

export default function Signup() {
  const login = useAuthStore((s) => s.login);

  return (
    <View style={[GlobalStyles.screen, { padding: 24, justifyContent: "center" }]}>
      <SynapseLogo />

      <Text style={GlobalStyles.heading2}>Create Account</Text>
      <Text style={GlobalStyles.body}>Start growing your knowledge garden 🌱</Text>

      <InputField placeholder="Full Name" />
      <InputField placeholder="Email" />
      <InputField placeholder="Password" secureTextEntry />

      <PrimaryButton
        label="Sign Up"
        onPress={() => {
          login();
          router.replace("/(tabs)/home");
        }}
      />

      <PrimaryButton
        label="Back to Login"
        variant="secondary"
        onPress={() => router.push("/(auth)/login")}
      />
    </View>
  );
}