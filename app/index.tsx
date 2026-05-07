import { Redirect } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";

export default function Index() {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)/home" />;
}