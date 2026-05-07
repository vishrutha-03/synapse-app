import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native";
import { GlobalStyles } from "../../theme/theme";
import DeckCard from "../../components/DeckCard";

export default function Decks() {
  return (
    <SafeAreaView style={GlobalStyles.screen}>
        <ScrollView style={GlobalStyles.screen} contentContainerStyle={GlobalStyles.scrollContent}>
      <Text style={GlobalStyles.heading2}>📚 Deck Library</Text>
      <Text style={GlobalStyles.body}>
        Your saved flashcard decks live here.
      </Text>

      <DeckCard title="Operating Systems" cards={18} />
      <DeckCard title="DBMS" cards={12} />
      <DeckCard title="DSA Revision" cards={25} />
      <DeckCard title="Maths Linear Algebra" cards={10} />
    </ScrollView>
    </SafeAreaView>
    
  );
}