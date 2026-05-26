import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography } from "../theme/theme";

export default function SynapseLogo() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Synapse</Text>
      <Text style={styles.sub}>grow your knowledge 🌿</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    alignItems: "center",
  },
  logo: {
    fontFamily: Typography.fontSerifSemiBold,
    fontSize: 44,
    color: Colors.inkDark,
    letterSpacing: -1,
  },
  sub: {
    fontFamily: Typography.fontSans,
    fontSize: 14,
    color: Colors.inkLight,
    marginTop: 4,
  },
});