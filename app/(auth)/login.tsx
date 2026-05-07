import { View, Text } from "react-native";
import { router } from "expo-router";
import SynapseLogo from "@/components/SynapseLogo";
import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { GlobalStyles } from "../../theme/theme";
import { useAuthStore } from "../../store/useAuthStore";

export default function Login() {
  const login = useAuthStore((s) => s.login);

  return (
    <View style={[GlobalStyles.screen, { padding: 24, justifyContent: "center" }]}>
      <SynapseLogo />

      <Text style={GlobalStyles.heading2}>Welcome Back</Text>
      <Text style={GlobalStyles.body}>Log into Synapse to continue 🌿</Text>

      <InputField placeholder="Email" />
      <InputField placeholder="Password" secureTextEntry />

      <PrimaryButton
        label="Login"
        onPress={() => {
          login();
          router.replace("/(tabs)/home");
        }}
      />

      <PrimaryButton
        label="Go to Signup"
        variant="secondary"
        onPress={() => router.push("/(auth)/signup")}
      />
    </View>
  );
}