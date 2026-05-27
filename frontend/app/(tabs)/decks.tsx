import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";

import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";
import DeckCard from "../../components/DeckCard";
import { useAuthStore } from "../../store/useAuthStore";

const FILTERS = ["All", "Recent"];

type Deck = {
  id: string;
  title: string;
  card_count: number;
  emoji: string;
  color: string;
};

export default function Decks() {
  const token = useAuthStore((s) => s.token);
  const [activeFilter, setActiveFilter] = useState("All");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      console.log("TOKEN:", token);
      try {
        const res = await fetch("http://127.0.0.1:8000/decks/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("DECKS RESPONSE:", JSON.stringify(data)); 
        setDecks(data);
      } catch (e) {
        console.error("Failed to fetch decks", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const totalCards = decks.reduce((sum, d) => sum + d.card_count, 0);

  

  return (

    
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>DECKS</Text>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => router.push("/(tabs)/upload")}
          >
            <Text style={styles.newBtnText}>+ NEW</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>All your flashcard decks in one place.</Text>

        {/* Stats Row — now dynamic */}
        <View style={styles.statsRow}>
          {[
            { label: "Total Decks", value: String(decks.length), color: Colors.yellow },
            { label: "Total Cards", value: String(totalCards), color: Colors.purple },
            { label: "Studied Today", value: "0", color: Colors.primary },
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
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
        ) : decks.length === 0 ? (
          <Text style={styles.emptyText}>No decks yet. Upload a file to get started!</Text>
        ) : (
          decks.map((deck) => (
            <DeckCard
              key={deck.id}
              title={deck.title}
              cards={deck.card_count}
              onPress={() => router.push(`/decks/${deck.id}`)}
            />
          ))
        )}
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

