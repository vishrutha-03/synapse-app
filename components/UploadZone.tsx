import { Pressable, Text } from "react-native";
import { GlobalStyles } from "../theme/theme";

export default function UploadZone() {
  return (
    <Pressable
      style={GlobalStyles.cardAccent}
      onPress={() => alert("PDF upload logic coming soon")}
    >
      <Text style={GlobalStyles.heading3}>📄 Upload Lecture PDF</Text>
      <Text style={GlobalStyles.bodySmall}>
        Tap to select lecture slides (placeholder)
      </Text>
    </Pressable>
  );
}