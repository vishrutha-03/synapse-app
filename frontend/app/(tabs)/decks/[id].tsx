import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

import Flashcard from "@/components/Flashcard";
import { Colors, Typography, Spacing } from "@/theme/theme";
import { useAuthStore } from "@/store/useAuthStore";

const CARD_COLORS = ["#FFD60A", "#8A4FFF", "#00E0A4", "#FF4D6D", "#4D9FFF"];

type Flashcard_ = {
  id: string;
  question: string;
  answer: string;
};

export default function DeckScreen() {
  const { id } = useLocalSearchParams();
  const token = useAuthStore((s) => s.token);

  const [cards, setCards] = useState<Flashcard_[]>([]);
  const [title, setTitle] = useState("");
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/decks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTitle(data.title);
        setCards(data.flashcards);
      } catch (e) {
        console.error("Failed to fetch deck", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
      </SafeAreaView>
    );
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <Text style={{ color: Colors.textMuted, marginTop: 32 }}>No flashcards in this deck.</Text>
      </SafeAreaView>
    );
  }

  const current = cards[index];

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>

      <Flashcard
        cardData={{
          topic: `Card ${index + 1} of ${cards.length}`,
          question: current.question,
          answer: current.answer,
          bgColor: CARD_COLORS[index % CARD_COLORS.length],
        }}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.btn}
          disabled={index === 0}
          onPress={() => setIndex((prev) => prev - 1)}
        >
          <Text style={styles.btnText}>← Prev</Text>
        </TouchableOpacity>

        <Text style={styles.counter}>
          {index + 1} / {cards.length}
        </Text>

        <TouchableOpacity
          style={styles.btn}
          disabled={index === cards.length - 1}
          onPress={() => setIndex((prev) => prev + 1)}
        >
          <Text style={styles.btnText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size.xl,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  btn: {
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: Colors.black,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  btnText: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.size.sm,
    color: Colors.text,
  },
  counter: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
});