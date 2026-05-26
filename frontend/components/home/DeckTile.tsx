import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";

export default function DeckTile({
  title,
  cards,
  emoji,
  color,
  onPress,
}: {
  title: string;
  cards: number;
  emoji: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.deckCard, { backgroundColor: color }]} onPress={onPress}
>
      <Text style={styles.deckEmoji}>{emoji}</Text>

      <Text style={styles.deckTitle}>{title}</Text>
      <Text style={styles.deckSub}>{cards} cards</Text>

      <View style={styles.deckProgressBar}>
        <View style={styles.deckProgressFill} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deckCard: {
    width: "47%",
    borderRadius: Radii.md,
    borderWidth: 3,
    borderColor: Colors.border,
    padding: Spacing.base,
    ...Shadows.hardSm,
    minHeight: 140,
  },

  deckEmoji: {
    fontSize: 18,
    marginBottom: 10,
  },

  deckTitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "900",
    color: Colors.black,
  },

  deckSub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "700",
    color: Colors.black,
    opacity: 0.75,
    marginTop: 4,
  },

  deckProgressBar: {
    marginTop: Spacing.base,
    height: 6,
    width: "100%",
    backgroundColor: Colors.black,
    opacity: 0.25,
    borderRadius: 4,
    overflow: "hidden",
  },

  deckProgressFill: {
    width: "55%",
    height: "100%",
    backgroundColor: Colors.black,
    opacity: 0.7,
  },
});