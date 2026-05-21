import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

import Flashcard from "@/components/Flashcard";
import osCards from "@/data/operatingSystems.json";

import { Colors, Typography, Spacing } from "@/theme/theme";

export default function OperatingSystemsDeck() {
  const [index, setIndex] = useState(0);

  const current = osCards[index];

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>OPERATING SYSTEMS</Text>

      <Flashcard
        cardData={{
          topic: current.topic,
          question: current.question,
          answer: current.answer,
          bgColor: current.bg_color,
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
          {index + 1} / {osCards.length}
        </Text>

        <TouchableOpacity
          style={styles.btn}
          disabled={index === osCards.length - 1}
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