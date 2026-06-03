import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";
import DeckCard from "../../components/DeckCard";
import DashboardStats from "../../components/DashboardStats";
import { useDecksEngine, Deck, FilterMode } from "@/hooks/useDecksEngine";

const FILTER_OPTIONS: FilterMode[] = ["ALL", "RECENT"];

export default function DecksScreen() {
  const engine = useDecksEngine();

  // Control drawer panel state profiles
  const [manageDeckModal, setManageDeckModal] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [targetDeck, setTargetDeck] = useState<Deck | null>(null);
  const [deckNameInput, setDeckNameInput] = useState("");

  const handleDeckOptionsTrigger = (deck: Deck) => {
    setTargetDeck(deck);
    setDeckNameInput(deck.title);
    setIsEditingMode(false);
    setManageDeckModal(true);
  };

  const executeDeckRename = async () => {
    if (!targetDeck) return;
    try {
      await fetch(`${engine.API_BASE_URL}/decks/${targetDeck.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${engine.token}` 
        },
        body: JSON.stringify({ title: deckNameInput }),
      });
      engine.updateDeckTitleInState(targetDeck.id, deckNameInput);
      setManageDeckModal(false);
    } catch {
      console.error("Could not update the deck collection title name.");
    }
  };

  const executeDeckDelete = async () => {
    if (!targetDeck) return;
    try {
      await fetch(`${engine.API_BASE_URL}/decks/${targetDeck.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${engine.token}` },
      });
      engine.removeDeckFromState(targetDeck.id);
      setManageDeckModal(false);
    } catch {
      console.error("Could not completely remove deck item.");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>DECKS</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => router.push("/(tabs)/upload")}>
            <Text style={styles.createBtnText}>+ NEW</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.screenSubtitle}>All your flashcard decks in one place.</Text>

        {/* Stats Summary Panel */}
        <DashboardStats 
          totalDecks={engine.metrics.totalDecks} 
          totalCards={engine.metrics.totalCards} 
          studiedToday={0} 
        />

        {/* Filters Layout Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterBarContainer}>
          {FILTER_OPTIONS.map((f) => {
            const isSelected = engine.activeFilter === f;
            return (
              <TouchableOpacity key={f} onPress={() => engine.setActiveFilter(f)} style={[styles.filterPill, isSelected && styles.filterPillActive]}>
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Content Layout Dynamic Mapping Pipeline */}
        {engine.loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.centeredLoader} />
        ) : engine.decks.length === 0 ? (
          <Text style={styles.emptyFeedbackText}>No decks found. Upload a file to get started!</Text>
        ) : (
          <View style={styles.decksGridStack}>
            {engine.decks.map((deck) => (
              <DeckCard
                key={deck.id}
                title={deck.title}
                cards={deck.card_count}
                onPress={() => router.push(`/decks/${deck.id}`)}
                onOptionsPress={() => handleDeckOptionsTrigger(deck)} // Dynamic configuration hook mapping
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* ── INTERACTIVE PREMIUM ACTION BOTTOM DRAWERS ── */}
      <Modal visible={manageDeckModal} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setManageDeckModal(false)}>
          <Pressable style={styles.bottomSheetBox}>
            <View style={styles.sheetHandle} />

            {!isEditingMode ? (
              <View style={styles.sheetLayoutStack}>
                <Text style={styles.sheetTitle}>Deck Actions</Text>
                <Text style={styles.sheetSubtitle}>Manage or remove your active flashcard directory collection.</Text>
                
                <TouchableOpacity style={styles.sheetActionRowBtn} onPress={() => setIsEditingMode(true)}>
                  <Text style={styles.sheetActionText}>✏️ Rename Collection Folder</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.sheetActionRowBtn, styles.sheetActionDangerBtn]} onPress={executeDeckDelete}>
                  <Text style={[styles.sheetActionText, { color: "#FF4D6D" }]}>🗑️ Delete Entire Deck</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setManageDeckModal(false)}>
                  <Text style={styles.sheetCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.sheetLayoutStack}>
                <Text style={styles.sheetTitle}>Rename Collection</Text>
                
                <Text style={styles.inputLabel}>New Deck Name Title</Text>
                <TextInput style={styles.input} value={deckNameInput} onChangeText={setDeckNameInput} autoFocus />

                <View style={styles.modalBtns}>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => setIsEditingMode(false)}>
                    <Text style={styles.secondaryBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryBtn} onPress={executeDeckRename}>
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

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl, paddingBottom: 120 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  screenTitle: { fontFamily: Typography.fontDisplay, fontSize: Typography.size["2xl"], fontWeight: "900", color: Colors.text, letterSpacing: 2 },
  screenSubtitle: { fontFamily: Typography.fontBody, fontSize: Typography.size.base, fontWeight: "600", color: Colors.textMuted, marginTop: Spacing.sm },
  createBtn: { backgroundColor: Colors.primary, borderRadius: Radii.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderWidth: 3, borderColor: Colors.border, ...Shadows.hardSm },
  createBtnText: { fontFamily: Typography.fontBody, fontSize: Typography.size.sm, fontWeight: "900", color: Colors.black, letterSpacing: 1 },
  filterBar: { marginTop: Spacing.lg, marginBottom: Spacing.base },
  filterBarContainer: { gap: Spacing.sm },
  filterPill: { borderRadius: Radii.pill, paddingHorizontal: Spacing.base, paddingVertical: Spacing.xs + 4, borderWidth: 3, borderColor: Colors.border, backgroundColor: Colors.surface, ...Shadows.hardSm },
  filterPillActive: { backgroundColor: Colors.black },
  filterPillText: { fontFamily: Typography.fontBody, fontSize: Typography.size.sm, fontWeight: "900", color: Colors.text, letterSpacing: 1 },
  filterPillTextActive: { color: Colors.white },
  decksGridStack: { gap: Spacing.md },
  centeredLoader: { marginTop: 40 },
  emptyFeedbackText: { fontFamily: Typography.fontBody, fontSize: Typography.size.sm, color: Colors.textMuted, textAlign: "center", marginTop: 40, fontWeight: "600" },
  
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
  input: { borderWidth: 2, borderColor: Colors.black, borderRadius: Radii.sm, padding: Spacing.md, fontFamily: Typography.fontBody, fontSize: Typography.size.sm, color: Colors.text, backgroundColor: Colors.surface, marginBottom: Spacing.sm },
  modalBtns: { flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.md },
  primaryBtn: { flex: 1, backgroundColor: Colors.primary, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.sm, paddingVertical: Spacing.md, alignItems: "center", borderBottomWidth: 5, borderRightWidth: 5 },
  primaryBtnText: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.black },
  secondaryBtn: { flex: 1, backgroundColor: Colors.surface, borderWidth: 3, borderColor: Colors.black, borderRadius: Radii.sm, paddingVertical: Spacing.md, alignItems: "center" },
  secondaryBtnText: { fontFamily: Typography.fontBold, fontSize: Typography.size.sm, color: Colors.text },
});