import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";

export default function TodaySessionCard() {
  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionIcon}>
        <Text style={{ fontSize: 18 }}>🎯</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.sessionTitle}>24 cards due</Text>
        <Text style={styles.sessionSub}>~12 min to complete</Text>
      </View>

      <TouchableOpacity style={styles.goBtn}>
        <Text style={styles.goText}>Go →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sessionCard: {
    backgroundColor: Colors.black,
    borderWidth: 3,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...Shadows.hardMd,
  },

  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.yellow,
    borderWidth: 3,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  sessionTitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "900",
    color: Colors.white,
  },

  sessionSub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "600",
    color: Colors.white,
    opacity: 0.7,
    marginTop: 4,
  },

  goBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radii.pill,
    borderWidth: 3,
    borderColor: Colors.border,
  },

  goText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.black,
  },
});