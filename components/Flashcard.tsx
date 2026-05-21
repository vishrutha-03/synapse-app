import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Colors, Typography, Spacing, Radii } from "../theme/theme";

type FlashcardData = {
  topic: string;
  question: string;
  answer: string;
  bgColor?: string;
};

export default function Flashcard({ cardData }: { cardData: FlashcardData }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={() => setIsFlipped((prev) => !prev)}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.card,
        {
          backgroundColor: cardData.bgColor ?? Colors.yellow,

          borderRightWidth: pressed ? 3 : 7,
          borderBottomWidth: pressed ? 3 : 7,

          transform: pressed ? [{ translateX: 4 }, { translateY: 4 }] : [],
        },
      ]}
    >
      {/* Topic Badge */}
      <View style={styles.topicBadge}>
        <Text style={styles.topicText}>{cardData.topic}</Text>
      </View>

      {/* Question / Answer */}
      <View style={styles.content}>
        <Text style={styles.mainText}>
          {isFlipped ? cardData.answer : cardData.question}
        </Text>
      </View>

      {/* Hint */}
      {!isFlipped && <Text style={styles.tapHint}>tap to reveal answer</Text>}

      <Text style={styles.miniTap}>tap ↓</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 320,
    borderRadius: Radii.md,
    padding: Spacing.lg,

    borderWidth: 3,
    borderColor: Colors.black,

    justifyContent: "space-between",
  },

  topicBadge: {
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    alignSelf: "flex-start",
    borderWidth: 2,
    borderColor: Colors.black,
  },

  topicText: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.size.xs,
    letterSpacing: 1,
    color: Colors.black,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
  },

  mainText: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size.xl,
    textAlign: "center",
    color: Colors.black,
  },

  tapHint: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "700",
    color: Colors.black,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: Spacing.md,
  },

  miniTap: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.md,
    fontFamily: Typography.fontBold,
    fontSize: Typography.size.xs,
    color: Colors.black,
    opacity: 0.6,
  },
});