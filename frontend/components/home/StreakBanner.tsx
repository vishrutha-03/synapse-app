import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";

export default function StreakBanner({
  streakDays,
  bestDays,
}: {
  streakDays: number;
  bestDays: number;
}) {
  // Determine text based on whether the streak is active or sitting at zero
  const subText = streakDays > 0 ? "Keep it going today! 🙌" : "Study a deck today to start a streak!";
  const titleText = streakDays > 0 ? `${streakDays}-day streak!` : "No active streak";

  return (
    <View style={styles.streakCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.streakTitle}>🔥 {titleText}</Text>
        <Text style={styles.streakSub}>{subText}</Text>
      </View>

      <View style={styles.bestPill}>
        <Text style={styles.bestText}>BEST: {bestDays}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  streakCard: {
    backgroundColor: Colors.secondary,
    borderWidth: 3,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Shadows.hardMd,
  },

  streakTitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.md,
    fontWeight: "900",
    color: Colors.white,
  },

  streakSub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: Colors.white,
    opacity: 0.9,
    marginTop: 4,
  },

  bestPill: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
  },

  bestText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1,
  },
});