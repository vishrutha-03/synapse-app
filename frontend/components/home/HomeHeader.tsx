import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, Shadows } from "../../theme/theme";

export default function HomeHeader({
  name,
  subtitle,
}: {
  name: string;
  subtitle: string;
}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greetingTitle}>
          Good morning,{"\n"}
          {name} 👋
        </Text>
        <Text style={styles.greetingSub}>{subtitle}</Text>
      </View>

      <View style={styles.avatarCircle}>
        <Text style={styles.avatarEmoji}>🪙</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },

  greetingTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size["2xl"],
    fontWeight: "900",
    color: Colors.text,
    lineHeight: Typography.size["2xl"] * 1.05,
  },

  greetingSub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: Colors.textGhost,
    marginTop: 6,
  },

  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.yellow,
    borderWidth: 3,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.hardSm,
  },

  avatarEmoji: {
    fontSize: 18,
  },
});