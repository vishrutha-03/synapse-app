import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";
import DeckCard from "../../components/DeckCard";

const FILTERS = ["All", "Recent", "Favorites", "CS", "Maths"];

const DECKS = [
  { title: "Operating Systems", cards: 18, color: Colors.yellow, tag: "CS" },
  { title: "DBMS", cards: 12, color: Colors.purple, tag: "CS" },
  { title: "DSA Revision", cards: 25, color: Colors.secondary, tag: "CS" },
  { title: "Maths Linear Algebra", cards: 10, color: Colors.primary, tag: "Maths" },
];

export default function Decks() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? DECKS
      : DECKS.filter((d) => d.tag === activeFilter);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>DECKS</Text>

          <TouchableOpacity style={styles.newBtn}>
            <Text style={styles.newBtnText}>+ NEW</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>All your flashcard decks in one place.</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: "Total Decks", value: "4", color: Colors.yellow },
            { label: "Total Cards", value: "65", color: Colors.purple },
            { label: "Studied Today", value: "2", color: Colors.primary },
          ].map((s, i) => (
            <View key={i} style={[styles.statBox, { backgroundColor: s.color }]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}
          contentContainerStyle={{ gap: Spacing.sm }}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f;

            return (
              <TouchableOpacity
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {f.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Deck List */}
        {filtered.map((deck, i) => (
          <DeckCard key={i} title={deck.title} cards={deck.cards} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size["2xl"],
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: 2,
  },

  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "600",
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },

  newBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
  },

  newBtnText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1,
  },

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

  filtersRow: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.base,
  },

  filterPill: {
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs + 4,
    borderWidth: 3,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    ...Shadows.hardSm,
  },

  filterPillActive: {
    backgroundColor: Colors.black,
  },

  filterText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: 1,
  },

  filterTextActive: {
    color: Colors.white,
  },
});