import { View, StyleSheet } from "react-native";
import DeckTile from "./DeckTile";

export default function DeckGrid() {
  return (
    <View style={styles.deckGrid}>
      <DeckTile title="Operating Systems" cards={84} emoji="💻" color="#FFD60A" />
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