import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import DeckTile from "./DeckTile";
import { useAuthStore } from "@/store/useAuthStore";
type Deck = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  card_count: number;
};

export default function DeckGrid() {
  const token = useAuthStore((s) => s.token);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/decks/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDecks(data);
      } catch (e) {
        console.error("Failed to fetch decks", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  if (loading) return <ActivityIndicator />;
  if (decks.length === 0) return <Text style={{ color: "#aaa" }}>No decks yet.</Text>;

  return (
    <View style={styles.deckGrid}>
      {decks.map((deck) => (
        <DeckTile
          key={deck.id}
          title={deck.title}
          cards={deck.card_count}
          emoji={deck.emoji}
          color={deck.color}
          onPress={() => router.push(`/decks/${deck.id}`)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  deckGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
});