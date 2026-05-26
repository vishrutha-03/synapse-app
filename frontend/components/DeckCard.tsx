import { GlobalStyles } from "@/theme/theme";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function DeckCard({ title, cards, onPress }: any) {
  return (
    <TouchableOpacity style={GlobalStyles.card} onPress={onPress} activeOpacity={0.9}>
      <Text>{title}</Text>
      <Text>{cards} cards</Text>
    </TouchableOpacity>
  );
}