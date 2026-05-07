import { View, Text } from "react-native";
import { GlobalStyles } from "../theme/theme";

type Props = {
  summary: string;
};

export default function SummaryView({ summary }: Props) {
  return (
    <View style={GlobalStyles.card}>
      <Text style={GlobalStyles.heading3}>✨ Summary</Text>
      <Text style={GlobalStyles.body}>{summary}</Text>
    </View>
  );
}