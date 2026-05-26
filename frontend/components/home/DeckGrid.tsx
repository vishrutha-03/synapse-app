import { View, StyleSheet } from "react-native";
import {router} from "expo-router"
import DeckTile from "./DeckTile";

export default function DeckGrid() {
  return (
    <View style={styles.deckGrid}>
      <DeckTile title="Operating Systems" cards={18} emoji="💻" color="#FFD60A" onPress={() => router.push("/decks/operating-systems")} />
      <DeckTile title="DBMS" cards={52} emoji="📚" color="#8A4FFF" />
      <DeckTile title="Computer Networks" cards={120} emoji="🛜" color="#00E0A4" />
      <DeckTile title="Data Structures" cards={200} emoji="👩‍🎓" color="#FF4D6D" />
    </View>
  );
}

const styles = StyleSheet.create({
  deckGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
});