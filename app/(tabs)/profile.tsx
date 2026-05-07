import { View, Text } from "react-native";
import { router } from "expo-router";
import { GlobalStyles } from "../../theme/theme";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuthStore } from "../../store/useAuthStore";

export default function Profile() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={[GlobalStyles.screen, { padding: 24, justifyContent: "center" }]}>
      <Text style={GlobalStyles.heading2}>🍃 Profile</Text>
      <Text style={GlobalStyles.body}>
        This will later include stats, streak history, and settings.
      </Text>

      <PrimaryButton
        label="Logout"
        variant="secondary"
        onPress={() => {
          logout();
          router.replace("/(auth)/login");
        }}
      />
    </View>
  );
}