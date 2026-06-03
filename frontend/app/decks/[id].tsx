import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import Flashcard from "@/components/Flashcard";
import QuizModeView from "@/components/QuizModeView"; 
import { Colors, Spacing, Radii, Typography } from "@/theme/theme";
import { useAuthStore } from "@/store/useAuthStore";
import { useDeckEngine, Card } from "@/hooks/useDeckEngine";

const CARD_COLORS = ["#FFD60A", "#8A4FFF", "#00E0A4", "#FF4D6D", "#4D9FFF"];

export default function DeckScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const token = useAuthStore((s) => s.token);
  
  const engine = useDeckEngine(id, token);

  // Core Management State for the Premium Bottom Sheet UI Drawer Panel
  const [manageCardModal, setManageCardModal] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [targetCard, setTargetCard] = useState<Card | null>(null);
  
  // Controlled Sheet Input States
  const [cardQ, setCardQ] = useState("");
  const [cardA, setCardA] = useState("");

  // Sync Status Tracking State
  const [isSyncing, setIsSyncing] = useState(false);

  // ── NEW METRICS SYNC PIPELINE ──
  const syncStudySession = async (shouldGoBack = false) => {
    if (!token) return;
    
    // Total calculation of reviews handled during this pass
    const totalReviewed = 
      engine.studySummary.gotIt + 
      engine.studySummary.easy + 
      engine.studySummary.hard;

    alert(`Attempting to sync! Total: ${totalReviewed}, GotIt: ${engine.studySummary.gotIt}, Easy: ${engine.studySummary.easy}`);

    if (totalReviewed === 0) {
      if (shouldGoBack) engine.setMode("browse");
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch(`${engine.API}/users/study-logs/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deck_id: id,
          cards_reviewed: totalReviewed,
          // Sending true/positive scores down to server session storage
          correct_count: engine.studySummary.gotIt + engine.studySummary.easy, 
        }),
      });

      if (response.ok) {
        console.log("📊 Study metrics saved to MongoDB successfully!");
      } else {
        console.error("Backend rejected telemetry payload.");
      }
    } catch (err) {
      console.error("Network framework pipeline blackout:", err);
    } finally {
      setIsSyncing(false);
      if (shouldGoBack) {
        engine.setMode("browse");
      }
    }
  };

  const handleCardOptionsTrigger = (card: Card) => {
    setTargetCard(card);
    setCardQ(card.question);
    setCardA(card.answer);
    setIsEditingMode(false); // Default view is action menu selection grid
    setManageCardModal(true);
  };

  const executeCardUpdate = async () => {
    if (!targetCard) return;
    try {
      await fetch(`${engine.API}/decks/${id}/cards/${targetCard.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: cardQ, answer: cardA }),
      });
      engine.setCards((prev) =>
        prev.map((c) => (c.id === targetCard.id ? { ...c, question: cardQ, answer: cardA } : c))
      );
      setManageCardModal(false);
      engine.setIsBrowseFlipped(false);
    } catch {
      console.error("Could not update flashcard.");
    }
  };

  const executeCardDelete = async () => {
    if (!targetCard) return;
    try {
      await fetch(`${engine.API}/decks/${id}/cards/${targetCard.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedCards = engine.cards.filter((c) => c.id !== targetCard.id);
      engine.setCards(updatedCards);
      engine.setBrowseIndex((prev) => Math.min(prev, Math.max(0, updatedCards.length - 1)));
      setManageCardModal(false);
      engine.setIsBrowseFlipped(false);
    } catch {
      console.error("Could not delete flashcard.");
    }
  };

  if (engine.loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
      </SafeAreaView>
    );
  }

  if (engine.mode === "quiz") return <QuizModeView engine={engine} styles={styles} />;

  if (engine.mode === "study") {
    if (engine.studyDone) {
      return (
        <SafeAreaView style={styles.safe}>
          <Text style={styles.title}>Study complete 🎉</Text>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>🟢 GOT IT!</Text><Text style={styles.summaryCount}>{engine.studySummary.gotIt}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>🟡 NEEDS REVISION</Text><Text style={styles.summaryCount}>{engine.studySummary.easy}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>🔴 DIDN'T GET IT</Text><Text style={styles.summaryCount}>{engine.studySummary.hard}</Text></View>
          </View>
          
          <TouchableOpacity 
            style={[styles.primaryBtn, { backgroundColor: Colors.primary }]} 
            onPress={() => syncStudySession(false).then(() => engine.startStudy())}
            disabled={isSyncing}
          >
            <Text style={styles.primaryBtnText}>
              {isSyncing ? "Saving..." : "Sync & Study again"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryBtn, { marginTop: Spacing.sm }]} 
            onPress={() => syncStudySession(true)}
            disabled={isSyncing}
          >
            <Text style={styles.secondaryBtnText}>
              {isSyncing ? "Saving data..." : "Save & Back to deck"}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    const studyCard = engine.studyQueue[engine.studyIndex];
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.modeHeader}>
          {/* Automatically syncs metrics if they decide to quit mid-session */}
          <TouchableOpacity onPress={() => syncStudySession(true)}>
            <Text style={styles.backLink}>← Save & Exit</Text>
          </TouchableOpacity>
          <Text style={styles.modeLabel}>Study mode</Text>
          <Text style={styles.counter}>{engine.studyIndex + 1}/{engine.studyQueue.length}</Text>
        </View>
        <Flashcard
          cardData={{
            topic: `Card ${engine.studyIndex + 1} of ${engine.studyQueue.length}`,
            question: studyCard.question,
            answer: studyCard.answer,
            bgColor: CARD_COLORS[engine.studyIndex % CARD_COLORS.length],
          }}
          isFlipped={engine.studyFlipped}
          onFlip={() => engine.setStudyFlipped((p) => !p)}
        />
        {engine.studyFlipped ? (
          <View style={styles.ratingRow}>
            <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: "#FF4D6D" }]} onPress={() => engine.rateCard("hard")}><Text style={styles.ratingBtnText}>Hard 😓</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: "#FFD60A" }]} onPress={() => engine.rateCard("easy")}><Text style={styles.ratingBtnText}>Easy 🙂</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: "#00E0A4" }]} onPress={() => engine.rateCard("got_it")}><Text style={styles.ratingBtnText}>Got it ✅</Text></TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.ratingHint}>Flip the card, then rate yourself</Text>
        )}
      </SafeAreaView>
    );
  }

  // --- DEFAULT BROWSE SYSTEM LAYOUT ---
  const current = engine.cards[engine.browseIndex];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{engine.emoji} {engine.title.toUpperCase()}</Text>
      </View>

      {current && (
        <Flashcard
          cardData={{
            topic: `Card ${engine.browseIndex + 1} of ${engine.cards.length}`,
            question: current.question,
            answer: current.answer,
            bgColor: CARD_COLORS[engine.browseIndex % CARD_COLORS.length],
          }}
          isFlipped={engine.isBrowseFlipped}
          onFlip={() => engine.setIsBrowseFlipped((p) => !p)}
          onOptionsPress={() => handleCardOptionsTrigger(current)}
        />
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, engine.browseIndex === 0 && styles.btnDisabled]}
          disabled={engine.browseIndex === 0}
          onPress={() => { engine.setBrowseIndex((p) => p - 1); engine.setIsBrowseFlipped(false); }}
        >
          <Text style={styles.btnText}>← Prev</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{engine.browseIndex + 1} / {engine.cards.length}</Text>
        <TouchableOpacity
          style={[styles.btn, engine.browseIndex === engine.cards.length - 1 && styles.btnDisabled]}
          disabled={engine.browseIndex === engine.cards.length - 1}
          onPress={() => { engine.setBrowseIndex((p) => p + 1); engine.setIsBrowseFlipped(false); }}
        >
          <Text style={styles.btnText}>Next →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.modeRow}>
        <TouchableOpacity style={styles.modeBtn} onPress={engine.startStudy}><Text style={styles.modeBtnText}>🧠 Study</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.modeBtn, styles.modeBtnQuiz]} onPress={engine.startQuiz}><Text style={styles.modeBtnText}>📝 Quiz</Text></TouchableOpacity>
      </View>

      {/* ── HIGHLY PROFESSIONAL PANEL ACTION SHEET DRAWERS ── */}
      <Modal visible={manageCardModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setManageCardModal(false)}>
          <Pressable style={styles.bottomSheetBox}>
            <View style={styles.sheetHandle} />

            {!isEditingMode ? (
              <View style={styles.sheetLayoutStack}>
                <Text style={styles.sheetTitle}>Card Options</Text>
                <Text style={styles.sheetSubtitle}>Manage the presentation data structure of this active card index element.</Text>
                
                <TouchableOpacity style={styles.sheetActionRowBtn} onPress={() => setIsEditingMode(true)}>
                  <Text style={styles.sheetActionText}>✏️ Edit Card Content</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.sheetActionRowBtn, styles.sheetActionDangerBtn]} onPress={executeCardDelete}>
                  <Text style={[styles.sheetActionText, { color: "#FF4D6D" }]}>🗑️ Delete Card From Deck</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setManageCardModal(false)}>
                  <Text style={styles.sheetCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.sheetLayoutStack}>
                <Text style={styles.sheetTitle}>Edit Card Text</Text>
                
                <Text style={styles.inputLabel}>Question Prompt</Text>
                <TextInput style={[styles.input, styles.inputMulti]} value={cardQ} onChangeText={setCardQ} multiline />

                <Text style={styles.inputLabel}>Answer Prompt</Text>
                <TextInput style={[styles.input, styles.inputMulti]} value={cardA} onChangeText={setCardA} multiline />

                <View style={styles.modalBtns}>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => setIsEditingMode(false)}>
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={executeCardUpdate}>
                    <Text style={styles.primaryBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles remain unchanged ──
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: Spacing.base, paddingTop: Spacing.xl },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.lg },
  title: { fontFamily: Typography.fontDisplay, fontSize: Typography.size.xl, color: Colors.text },
  controls: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: Spacing.lg },
  btn: { backgroundColor: Colors.surface, borderWidth: 3, borderColor: Colors.black, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radii.sm },
  btnDisabled: { opacity: 0.3 },
  btnText: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.text },
  counter: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.textMuted },
  modeRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  modeBtn: { flex: 1, backgroundColor: Colors.primary, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.sm, paddingVertical: Spacing.md, alignItems: "center", borderBottomWidth: 5, borderRightWidth: 5 },
  modeBtnQuiz: { backgroundColor: "#00E0A4" },
  modeBtnText: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.black },
  
  modeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.lg },
  modeLabel: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.textMuted, textTransform: "uppercase", letterSpacing: 1 },
  backLink: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.primary },
  ratingRow: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  ratingBtn: { flex: 1, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.sm, paddingVertical: Spacing.md, alignItems: "center", borderBottomWidth: 5, borderRightWidth: 5 },
  ratingBtnText: { fontFamily: Typography.fontBold, fontSize: Typography.size.xs, color: Colors.black },
  ratingHint: { fontFamily: Typography.fontBody, fontSize: Typography.size.sm, color: Colors.textMuted, textAlign: "center", marginTop: Spacing.lg },
  summaryBox: { marginTop: Spacing.xl, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.md, overflow: "hidden", marginBottom: Spacing.xl },
  summaryRow: { flexDirection: "row", alignItems: "center", padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.black, gap: Spacing.sm },
  summaryLabel: { flex: 1, fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.text },
  summaryCount: { fontFamily: Typography.fontBold, fontSize: Typography.size.lg, color: Colors.text },
  
  quizQuestion: { backgroundColor: Colors.surface, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.md, padding: Spacing.lg, marginBottom: Spacing.lg, minHeight: 120, justifyContent: "center" },
  quizQuestionText: { fontFamily: Typography.fontDisplay, fontSize: Typography.size.lg, color: Colors.text, textAlign: "center" },
  optionsGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  optionBtn: { flexDirection: "row", alignItems: "center", borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.sm, padding: Spacing.md, gap: Spacing.md, borderBottomWidth: 5, borderRightWidth: 5 },
  optionLetter: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.black, width: 20, textAlign: "center" },
  optionText: { flex: 1, fontFamily: Typography.fontBody, fontSize: Typography.size.sm, color: Colors.text },
  quizScore: { fontFamily: Typography.fontDisplay, fontSize: Typography.size.xl, color: Colors.text, textAlign: "center", marginTop: Spacing.xl },
  quizScoreEmoji: { fontSize: 64, textAlign: "center", marginVertical: Spacing.lg },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  bottomSheetBox: { backgroundColor: Colors.bg, borderTopLeftRadius: Radii.md, borderTopRightRadius: Radii.md, borderWidth: 3, borderBottomWidth: 0, borderColor: Colors.black, padding: Spacing.lg, paddingBottom: 42, width: "100%" },
  sheetHandle: { width: 40, height: 5, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 3, alignSelf: "center", marginBottom: Spacing.md },
  sheetLayoutStack: { gap: Spacing.sm },
  sheetTitle: { fontFamily: Typography.fontDisplay, fontSize: Typography.size.lg, color: Colors.text },
  sheetSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.size.xs, color: Colors.textMuted },
  sheetActionRowBtn: { backgroundColor: Colors.surface, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.sm, padding: Spacing.md, borderBottomWidth: 5, borderRightWidth: 5 },
  sheetActionDangerBtn: { backgroundColor: "rgba(255, 77, 109, 0.12)" },
  sheetActionText: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.text },
  sheetCancelBtn: { paddingVertical: Spacing.xs, alignItems: "center" },
  sheetCancelText: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.textMuted },
  
  inputLabel: { fontFamily: Typography.fontBold, fontSize: Typography.size.xs, color: Colors.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginTop: Spacing.xs },
  input: { borderWidth: 2, borderColor: Colors.black, borderRadius: Radii.sm, padding: Spacing.md, fontFamily: Typography.fontBody, fontSize: Typography.size.sm, color: Colors.text, backgroundColor: Colors.surface },
  inputMulti: { minHeight: 70, textAlignVertical: "top" },
  modalBtns: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  primaryBtn: { flex: 1, backgroundColor: Colors.primary, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.sm, paddingVertical: Spacing.md, alignItems: "center", borderBottomWidth: 5, borderRightWidth: 5 },
  primaryBtnText: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.black },
  secondaryBtn: { flex: 1, backgroundColor: Colors.surface, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.sm, paddingVertical: Spacing.md, alignItems: "center" },
  secondaryBtnText: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.text },
});