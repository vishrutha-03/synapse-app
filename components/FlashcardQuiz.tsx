import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { GlobalStyles } from "../theme/theme";

export default function FlashcardQuiz() {
  const [flipped, setFlipped] = useState(false);

  return (
    <View style={GlobalStyles.card}>
      <Text style={GlobalStyles.heading3}>🃏 Flashcard Quiz</Text>

      <Pressable
        style={[GlobalStyles.cardAlt, { marginTop: 12 }]}
        onPress={() => setFlipped(!flipped)}
      >
        <Text style={GlobalStyles.body}>
          {flipped
            ? "Answer: OS manages memory, CPU, and processes."
            : "What does an Operating System do?"}
        </Text>
      </Pressable>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
        <Pressable
          style={[GlobalStyles.btnSecondary, { flex: 1, marginRight: 8 }]}
          onPress={() => alert("Wrong (Swipe left placeholder)")}
        >
          <Text style={GlobalStyles.btnSecondaryText}>Wrong</Text>
        </Pressable>

        <Pressable
          style={[GlobalStyles.btnPrimary, { flex: 1, marginLeft: 8 }]}
          onPress={() => alert("Correct (Swipe right placeholder)")}
        >
          <Text style={GlobalStyles.btnPrimaryText}>Correct</Text>
        </Pressable>
      </View>
    </View>
  );
}