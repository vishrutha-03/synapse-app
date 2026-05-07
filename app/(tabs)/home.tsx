import { ScrollView, Text } from "react-native";
import { GlobalStyles } from "../../theme/theme";

import ProgressPlant from "@/components/ProgressPlant";
import UploadZone from "@/components/UploadZone";
import DeckCard from "@/components/DeckCard";
import SummaryView from "@/components/SummaryView";
import FlashcardQuiz from "@/components/FlashcardQuiz";

export default function Home() {
  return (
    <ScrollView style={GlobalStyles.screen} contentContainerStyle={GlobalStyles.scrollContent}>
      <Text style={GlobalStyles.heading1}>Synapse</Text>
      <Text style={GlobalStyles.body}>Your dashboard, warm and alive 🌿</Text>

      <ProgressPlant streak={6} />

      <UploadZone />

      <Text style={[GlobalStyles.heading3, { marginTop: 20 }]}>Recent Decks</Text>
      <DeckCard title="Operating Systems" cards={18} />
      <DeckCard title="DBMS" cards={12} />
      <DeckCard title="Computer Networks" cards={9} />

      <SummaryView summary="Your PDF summary will appear here after upload (placeholder)." />

      <FlashcardQuiz />
    </ScrollView>
  );
}