import { View, Text } from "react-native";
import { GlobalStyles } from "../theme/theme";

export default function ProgressPlant({ streak }: { streak: number }) {
  const stage =
    streak < 3 ? "🌱" : streak < 7 ? "🌿" : streak < 14 ? "🪴" : "🌳";

  return (
    <View style={GlobalStyles.card}>
      <Text style={GlobalStyles.heading3}>Streak Tracker</Text>
      <Text style={{ fontSize: 54, textAlign: "center", marginTop: 10 }}>
        {stage}
      </Text>
      <Text style={[GlobalStyles.body, { textAlign: "center" }]}>
        Current streak: {streak} days
      </Text>
    </View>
  );
}