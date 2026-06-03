import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors, Spacing, Radii, Shadows, Typography} from "@/theme/theme";


type StatsProps = {
  totalDecks: number;
  totalCards: number;
  studiedToday?: number;
};

export default function DashboardStats({ totalDecks, totalCards, studiedToday = 0 }: StatsProps) {
  const statItems = [
    { label: "Total Decks", value: String(totalDecks), color: Colors.yellow },
    { label: "Total Cards", value: String(totalCards), color: Colors.purple },
    { label: "Studied Today", value: String(studiedToday), color: Colors.primary },
  ];

  return (
    <View style={styles.statsRow}>
      {statItems.map((item, index) => (
        <View key={index} style={[styles.statBox, { backgroundColor: item.color }]}>
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  statBox: {
    flex: 1,
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
    alignItems: "center",
  },
  statValue: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xl,
    fontWeight: "900",
    color: Colors.black,
  },
  statLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "700",
    color: Colors.black,
    opacity: 0.75,
    textAlign: "center",
    marginTop: 2,
  },
});