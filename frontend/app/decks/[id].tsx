import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
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

  const [manageCardModal, setManageCardModal] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [targetCard, setTargetCard] = useState<Card | null>(null);
  const [cardQ, setCardQ] = useState("");
  const [cardA, setCardA] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  const syncStudySession = async (shouldGoBack = false) => {
    if (!token) return;
    const totalReviewed =
      engine.studySummary.gotIt + engine.studySummary.easy + engine.studySummary.hard;

    if (totalReviewed === 0) {
      if (shouldGoBack) engine.setMode("browse");
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch(`${engine.API}/users/study-logs/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deck_id: id,
          cards_reviewed: totalReviewed,
          correct_count: engine.studySummary.gotIt + engine.studySummary.easy,
        }),
      });
      if (response.ok) {
        console.log("Study metrics saved!");
      }
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
      if (shouldGoBack) engine.setMode("browse");
    }
  };

  const handleCardOptionsTrigger = (card: Card) => {
    setTargetCard(card);
    setCardQ(card.question);
    setCardA(card.answer);
    setIsEditingMode(false);
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

  // ── Loading ──────────────────────────────────────────────────────────────

  if (engine.loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
      </SafeAreaView>
    );
  }

  // ── Quiz mode ─────────────────────────────────────────────────────────────

  if (engine.mode === "quiz") return <QuizModeView engine={engine} styles={styles} />;

  // ── Study mode ────────────────────────────────────────────────────────────

  if (engine.mode === "study") {

    // ── Study complete screen ──
    if (engine.studyDone) {
      const total = engine.studySummary.gotIt + engine.studySummary.easy + engine.studySummary.hard;
      const masteredPct = total > 0 ? Math.round((engine.studySummary.gotIt / total) * 100) : 0;
      const easyPct    = total > 0 ? Math.round((engine.studySummary.easy   / total) * 100) : 0;
      const hardPct    = total > 0 ? Math.round((engine.studySummary.hard   / total) * 100) : 0;
      const heroEmoji  = masteredPct === 100 ? "🏆" : masteredPct >= 60 ? "🎓" : "📚";

      return (
        <SafeAreaView style={styles.safe}>
          <ScrollView showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={sc.header}>
              <TouchableOpacity onPress={() => engine.setMode("browse")}>
                <Text style={sc.backLink}>← Back</Text>
              </TouchableOpacity>
              <View style={sc.savedBadge}>
                <Text style={sc.savedBadgeText}>Session saved</Text>
              </View>
            </View>

            {/* Hero */}
            <View style={sc.hero}>
              <Text style={sc.heroIcon}>{heroEmoji}</Text>
              <Text style={sc.heroTitle}>Study complete</Text>
              <Text style={sc.heroSub}>{total} cards reviewed</Text>
            </View>

            {/* Stats grid */}
            <View style={sc.statsGrid}>
              <View style={[sc.statCard, { backgroundColor: "#E1F5EE" }]}>
                <Text style={[sc.statNum, { color: "#0F6E56" }]}>{engine.studySummary.gotIt}</Text>
                <Text style={[sc.statLabel, { color: "#085041" }]}>Got it</Text>
              </View>
              <View style={[sc.statCard, { backgroundColor: "#FAEEDA" }]}>
                <Text style={[sc.statNum, { color: "#854F0B" }]}>{engine.studySummary.easy}</Text>
                <Text style={[sc.statLabel, { color: "#633806" }]}>Needs work</Text>
              </View>
              <View style={[sc.statCard, { backgroundColor: "#FCEBEB" }]}>
                <Text style={[sc.statNum, { color: "#A32D2D" }]}>{engine.studySummary.hard}</Text>
                <Text style={[sc.statLabel, { color: "#791F1F" }]}>Missed</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={sc.barSection}>
              <Text style={sc.sectionLabel}>Performance breakdown</Text>
              <View style={sc.barTrack}>
                {masteredPct > 0 && <View style={[sc.barFill, { flex: masteredPct, backgroundColor: "#1D9E75" }]} />}
                {easyPct    > 0 && <View style={[sc.barFill, { flex: easyPct,    backgroundColor: "#EF9F27" }]} />}
                {hardPct    > 0 && <View style={[sc.barFill, { flex: hardPct,    backgroundColor: "#E24B4A" }]} />}
              </View>
              <View style={sc.barLabels}>
                <Text style={sc.barLabel}>{masteredPct}% mastered</Text>
                <Text style={sc.barLabel}>{100 - masteredPct}% to review</Text>
              </View>
            </View>

            {/* Revision roadmap */}
            <Text style={sc.sectionLabel}>Your revision roadmap</Text>
            <View style={sc.roadmap}>

              {engine.studySummary.hard > 0 && (
                <View style={sc.roadmapRow}>
                  <View style={[sc.dot, { backgroundColor: "#FCEBEB" }]}>
                    <Text style={sc.dotEmoji}>🔥</Text>
                  </View>
                  <View style={sc.roadmapText}>
                    <Text style={sc.roadmapTitle}>Review missed cards now</Text>
                    <Text style={sc.roadmapSub}>
                      {engine.studySummary.hard} card{engine.studySummary.hard > 1 ? "s" : ""} need immediate attention. Re-study before moving on.
                    </Text>
                  </View>
                  <View style={[sc.pill, { backgroundColor: "#FCEBEB" }]}>
                    <Text style={[sc.pillText, { color: "#A32D2D" }]}>Today</Text>
                  </View>
                </View>
              )}

              {engine.studySummary.easy > 0 && (
                <View style={[sc.roadmapRow, { borderBottomWidth: 1, borderBottomColor: Colors.black }]}>
                  <View style={[sc.dot, { backgroundColor: "#FAEEDA" }]}>
                    <Text style={sc.dotEmoji}>📖</Text>
                  </View>
                  <View style={sc.roadmapText}>
                    <Text style={sc.roadmapTitle}>Revisit easy cards</Text>
                    <Text style={sc.roadmapSub}>
                      {engine.studySummary.easy} card{engine.studySummary.easy > 1 ? "s" : ""} marked easy — confirm with one more pass.
                    </Text>
                  </View>
                  <View style={[sc.pill, { backgroundColor: "#FAEEDA" }]}>
                    <Text style={[sc.pillText, { color: "#854F0B" }]}>Tomorrow</Text>
                  </View>
                </View>
              )}

              <View style={[sc.roadmapRow, { borderBottomWidth: 0 }]}>
                <View style={[sc.dot, { backgroundColor: "#E1F5EE" }]}>
                  <Text style={sc.dotEmoji}>✅</Text>
                </View>
                <View style={sc.roadmapText}>
                  <Text style={sc.roadmapTitle}>Full deck refresh</Text>
                  <Text style={sc.roadmapSub}>
                    Run all {total} cards to cement long-term recall.
                  </Text>
                </View>
                <View style={[sc.pill, { backgroundColor: "#E1F5EE" }]}>
                  <Text style={[sc.pillText, { color: "#0F6E56" }]}>In 3 days</Text>
                </View>
              </View>

            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={sc.primaryBtn}
              onPress={() => syncStudySession(false).then(() => engine.startStudy())}
              disabled={isSyncing}
            >
              <Text style={sc.primaryBtnText}>{isSyncing ? "Saving..." : "Study again"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[sc.secondaryBtn, { marginTop: Spacing.sm, marginBottom: Spacing.xl }]}
              onPress={() => syncStudySession(true)}
              disabled={isSyncing}
            >
              <Text style={sc.secondaryBtnText}>{isSyncing ? "Saving..." : "Save & back to deck"}</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      );
    }

    // ── Active study card ──
    const studyCard = engine.studyQueue[engine.studyIndex];
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.modeHeader}>
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
            <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: "#FF4D6D" }]} onPress={() => engine.rateCard("hard")}>
              <Text style={styles.ratingBtnText}>Hard 😓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: "#FFD60A" }]} onPress={() => engine.rateCard("easy")}>
              <Text style={styles.ratingBtnText}>Easy 🙂</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: "#00E0A4" }]} onPress={() => engine.rateCard("got_it")}>
              <Text style={styles.ratingBtnText}>Got it ✅</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.ratingHint}>Flip the card, then rate yourself</Text>
        )}
      </SafeAreaView>
    );
  }

  // ── Browse mode (default) ─────────────────────────────────────────────────

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
        <TouchableOpacity style={styles.modeBtn} onPress={engine.startStudy}>
          <Text style={styles.modeBtnText}>🧠 Study</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.modeBtn, styles.modeBtnQuiz]} onPress={engine.startQuiz}>
          <Text style={styles.modeBtnText}>📝 Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Card options bottom sheet */}
      <Modal visible={manageCardModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setManageCardModal(false)}>
          <Pressable style={styles.bottomSheetBox}>
            <View style={styles.sheetHandle} />

            {!isEditingMode ? (
              <View style={styles.sheetLayoutStack}>
                <Text style={styles.sheetTitle}>Card Options</Text>
                <Text style={styles.sheetSubtitle}>Edit or delete this flashcard.</Text>

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

// ── Study complete styles ─────────────────────────────────────────────────────

const sc = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  backLink: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.size.sm,
    color: Colors.primary,
  },
  savedBadge: {
    backgroundColor: "#EEEDFE",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  savedBadgeText: {
    fontFamily: Typography.fontBold,
    fontSize: 11,
    color: "#3C3489",
  },
  hero: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  heroIcon: {
    fontSize: 52,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size.xl,
    color: Colors.text,
    marginBottom: 4,
  },
  heroSub: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: Radii.md,
    padding: Spacing.md,
    alignItems: "center",
  },
  statNum: {
    fontFamily: Typography.fontDisplay,
    fontSize: 28,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: Typography.fontBold,
    fontSize: 11,
  },
  barSection: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: Typography.fontBold,
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  barTrack: {
    flexDirection: "row",
    height: 10,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  barFill: {
    height: "100%",
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  barLabel: {
    fontFamily: Typography.fontBody,
    fontSize: 11,
    color: Colors.textMuted,
  },
  roadmap: {
    borderWidth: 3,
    borderColor: Colors.black,
    borderRadius: Radii.md,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  roadmapRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  dotEmoji: {
    fontSize: 15,
  },
  roadmapText: {
    flex: 1,
  },
  roadmapTitle: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.size.sm,
    color: Colors.text,
    marginBottom: 2,
  },
  roadmapSub: {
    fontFamily: Typography.fontBody,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  pillText: {
    fontFamily: Typography.fontBold,
    fontSize: 11,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.black,
    borderRadius: Radii.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderBottomWidth: 5,
    borderRightWidth: 5,
  },
  primaryBtnText: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.size.sm,
    color: Colors.black,
  },
  secondaryBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: Colors.black,
    borderRadius: Radii.sm,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontFamily: Typography.fontBold,
    fontSize: Typography.size.sm,
    color: Colors.text,
  },
});

// ── Main styles ───────────────────────────────────────────────────────────────

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