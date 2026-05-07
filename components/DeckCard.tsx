import { View, Text } from "react-native";
import { GlobalStyles } from "../theme/theme";

type Props = {
  title: string;
  cards: number;
};

export default function DeckCard({ title, cards }: Props) {
  return (
    <View style={GlobalStyles.cardFlat}>
      <Text style={GlobalStyles.heading3}>{title}</Text>
      <Text style={GlobalStyles.bodySmall}>{cards} cards</Text>
    </View>
  );
}