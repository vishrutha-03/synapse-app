import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/theme/theme";

export default function QuizModeView({ engine, styles }) {
  if (engine.quizDone) {
    const pct = Math.round((engine.quizScore / engine.quizCards.length) * 100);
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Quiz done!</Text>
        <Text style={styles.quizScore}>{engine.quizScore}/{engine.quizCards.length} — {pct}%</Text>
        <Text style={styles.quizScoreEmoji}>{pct === 100 ? "🏆" : pct >= 70 ? "🎯" : "📚"}</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={engine.startQuiz}>
          <Text style={styles.primaryBtnText}>Retry quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 12 }]} onPress={() => engine.setMode("browse")}>
          <Text style={styles.secondaryBtnText}>Back to deck</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const qCard = engine.quizCards[engine.quizIndex];
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.modeHeader}>
        <TouchableOpacity onPress={() => engine.setMode("browse")}><Text style={styles.backLink}>← Back</Text></TouchableOpacity>
        <Text style={styles.modeLabel}>Quiz mode</Text>
        <Text style={styles.counter}>{engine.quizIndex + 1}/{engine.quizCards.length}</Text>
      </View>

      <View style={styles.quizQuestion}>
        <Text style={styles.quizQuestionText}>{qCard?.question}</Text>
      </View>

      <View style={styles.optionsGrid}>
        {engine.quizOptions.map((opt, i) => {
          const selected = engine.quizSelected === i;
          const revealed = engine.quizSelected !== null;
          let bg = Colors.surface;
          if (revealed && opt.correct) bg = "#00E0A4";
          else if (selected && !opt.correct) bg = "#FF4D6D";

          return (
            <TouchableOpacity
              key={i}
              style={[styles.optionBtn, { backgroundColor: bg }]}
              onPress={() => engine.handleQuizSelect(i)}
              disabled={engine.quizSelected !== null}
            >
              <Text style={styles.optionLetter}>{["A", "B", "C", "D"][i]}</Text>
              <Text style={styles.optionText}>{opt.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {engine.quizSelected !== null && (
        <TouchableOpacity style={styles.primaryBtn} onPress={engine.nextQuizCard}>
          <Text style={styles.primaryBtnText}>
            {engine.quizIndex + 1 < engine.quizCards.length ? "Next →" : "See results"}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}