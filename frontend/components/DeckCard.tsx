import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { GlobalStyles, Colors, Typography, Spacing, Radii, Shadows } from "../theme/theme";

type DeckCardProps = {
  title: string;
  cards: number;
  onPress: () => void;
  onOptionsPress?: () => void; // Passing the option trigger action upward
};

export default function DeckCard({ title, cards, onPress, onOptionsPress }: DeckCardProps) {
  return (
    <TouchableOpacity 
      style={[GlobalStyles.card, styles.deckBox]} 
      onPress={onPress} 
      activeOpacity={0.9}
    >
      <View style={styles.cardContentLayout}>
        <View style={styles.textContainer}>
          <Text style={styles.deckTitle}>{title}</Text>
          <Text style={styles.deckCounter}>{cards} cards</Text>
        </View>

        {onOptionsPress && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation(); // Stop navigation from launching when managing settings
              onOptionsPress();
            }}
            style={styles.threeDotsBtn}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.threeDotsText}>⋮</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deckBox: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
  },
  cardContentLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  deckTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size.md,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  deckCounter: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    fontWeight: "700",
  },
  threeDotsBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radii.pill,
  },
  threeDotsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
    textAlign: "center",
    marginTop: -2,
  },
});