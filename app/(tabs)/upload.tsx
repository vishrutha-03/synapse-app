import { View, Text } from "react-native";
import { GlobalStyles } from "../../theme/theme";
import UploadZone from "../../components/UploadZone";
import SummaryView from "../../components/SummaryView";

export default function Upload() {
  return (
    <View style={[GlobalStyles.screen, { padding: 20 }]}>
      <Text style={GlobalStyles.heading2}>Upload PDF</Text>
      <Text style={GlobalStyles.body}>
        Upload lecture slides and generate summaries + flashcards.
      </Text>

      <UploadZone />

      <SummaryView summary="Summary will appear here after processing (placeholder)." />
    </View>
  );
}