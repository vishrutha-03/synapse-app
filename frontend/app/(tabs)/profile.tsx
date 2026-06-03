import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";
import { useProfileEngine } from "@/hooks/useProfileEngine";

export default function ProfileScreen() {
  const engine = useProfileEngine();

  if (engine.loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.centerWrapper}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (engine.error || !engine.profile) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.centerWrapper}>
          <Text style={styles.errorFeedbackText}>{engine.error ?? "Failed to sync connection details."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statCardsDataGrid = [
    { label: "Streak", value: `${engine.profile.streak}🔥`, color: Colors.secondary },
    { label: "Cards Tracked", value: String(engine.profile.total_cards_studied), color: Colors.purple },
    { label: "Decks Count", value: String(engine.profile.total_decks_created), color: Colors.primary },
    { label: "Accuracy", value: `${Math.round(engine.profile.correct_answers_ratio * 100)}%`, color: Colors.yellow },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.screenHeadingTitle}>PROFILE</Text>

        {/* ── LIVE INTERACTIVE AVATAR PASSPORT CARD ── */}
        <View style={[styles.avatarCard, { backgroundColor: Colors.yellow }]}>
          <View style={styles.avatarCircleBorder}>
            <Text style={styles.avatarEmoji}>🧑‍🎓</Text>
          </View>
          <View style={styles.identityStack}>
            <Text style={styles.userNameText}>{engine.profile.username.toUpperCase()}</Text>
            <Text style={styles.userTaglineText}>Synapse learner since {engine.profile.join_year}</Text>
            <View style={styles.levelBadgePill}>
              <Text style={styles.levelBadgePillText}>⭐ LEVEL {engine.currentLevel}</Text>
            </View>
          </View>
        </View>

        {/* ── LIVE SCOREBOARD PERFORMANCE GRID ── */}
        <View style={styles.statsGridMatrix}>
          {statCardsDataGrid.map((statItem, index) => (
            <View key={index} style={[styles.statBoxCard, { backgroundColor: statItem.color }]}>
              <Text style={styles.statMetricValue}>{statItem.value}</Text>
              <Text style={styles.statMetricLabel}>{statItem.label}</Text>
            </View>
          ))}
        </View>

        {/* ── DYNAMIC REWARDS RECOGNITION SYSTEM ── */}
        <Text style={styles.sectionDividerTitle}>🏆 Achievements</Text>
        <View style={styles.achieveGrid}>
          {engine.achievements.map((badgeItem, index) => (
            <View 
              key={index} 
              style={[
                styles.achieveBox, 
                { 
                  backgroundColor: badgeItem.unlocked ? badgeItem.color : "#E5E7EB",
                  opacity: badgeItem.unlocked ? 1 : 0.55 
                }
              ]}
            >
              <Text style={styles.achieveIcon}>{badgeItem.icon}</Text>
              <Text style={styles.achieveLabel}>{badgeItem.label}</Text>
              {!badgeItem.unlocked && <Text style={styles.lockedTextText}>🔒 Locked</Text>}
            </View>
          ))}
        </View>

{/* ── SETTINGS SHELF UTILITIES GRID ── */}
<Text style={styles.sectionDividerTitle}>⚙️ Settings</Text>
<View style={styles.settingsGroupCard}>
  {[
    { label: "🔔 Notifications", onPress: () => {} },
    { label: "📤 Export Data", onPress: () => {} },
    { label: "❓ Help & Support", onPress: () => router.push("/help-support") },
  ].map((item, index) => (
    <TouchableOpacity key={index} style={styles.settingsRowInteractive} activeOpacity={0.7} onPress={item.onPress}>
      <Text style={styles.settingsRowText}>{item.label}</Text>
      <Text style={styles.settingsRowArrowPointer}>→</Text>
    </TouchableOpacity>
  ))}
</View>
        {/* ── LOGOUT TRIGGER CONTAINER ACTION ── */}
        <TouchableOpacity
          style={styles.logoutBtnAction}
          activeOpacity={0.8}
          onPress={() => {
            engine.logout();
            router.replace("/(auth)/login");
          }}
        >
          <Text style={styles.logoutBtnActionText}>🚪 LOG OUT</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl, paddingBottom: 120 },
  screenHeadingTitle: { fontFamily: Typography.fontDisplay, fontSize: Typography.size["2xl"], fontWeight: "900", color: Colors.text, letterSpacing: 2 },
  centerWrapper: { flex: 1, alignItems: "center", justifyContext: "center", padding: Spacing.xl, marginTop: 100 },
  errorFeedbackText: { fontFamily: Typography.fontBody, fontSize: Typography.size.sm, color: "#FF4D6D", fontWeight: "700", textAlign: "center" },
  
  avatarCard: { flexDirection: "row", alignItems: "center", gap: Spacing.base, borderRadius: Radii.md, padding: Spacing.lg, borderWidth: 3, borderColor: Colors.border, ...Shadows.hardMd, marginTop: Spacing.base },
  avatarCircleBorder: { width: 64, height: 64, borderRadius: 18, backgroundColor: Colors.white, borderWidth: 3, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  avatarEmoji: { fontSize: 32 },
  identityStack: { flex: 1 },
  userNameText: { fontFamily: Typography.fontBody, fontSize: Typography.size.lg, fontWeight: "900", color: Colors.black },
  userTaglineText: { fontFamily: Typography.fontBody, fontSize: Typography.size.sm, fontWeight: "600", color: Colors.textMuted, marginTop: 2 },
  levelBadgePill: { marginTop: Spacing.sm, alignSelf: "flex-start", backgroundColor: Colors.black, borderRadius: Radii.pill, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderWidth: 3, borderColor: Colors.border },
  levelBadgePillText: { fontFamily: Typography.fontBody, fontSize: Typography.size.xs, fontWeight: "900", color: Colors.white, letterSpacing: 1 },
  
  statsGridMatrix: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginTop: Spacing.lg },
  statBoxCard: { width: "47%", borderRadius: Radii.md, padding: Spacing.md, borderWidth: 3, borderColor: Colors.border, ...Shadows.hardSm, alignItems: "center" },
  statMetricValue: { fontFamily: Typography.fontBody, fontSize: Typography.size.xl, fontWeight: "900", color: Colors.black },
  statMetricLabel: { fontFamily: Typography.fontBody, fontSize: Typography.size.xs, fontWeight: "700", color: Colors.black, opacity: 0.75, marginTop: 2 },
  
  sectionDividerTitle: { marginTop: Spacing.xl, fontFamily: Typography.fontBody, fontSize: Typography.size.md, fontWeight: "900", color: Colors.text },
  achieveGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm, marginTop: Spacing.md },
  achieveBox: { width: "47%", borderRadius: Radii.md, padding: Spacing.md, borderWidth: 3, borderColor: Colors.border, ...Shadows.hardSm, alignItems: "center", gap: Spacing.xs },
  achieveIcon: { fontSize: 28 },
  achieveLabel: { fontFamily: Typography.fontBody, fontSize: Typography.size.sm, fontWeight: "900", color: Colors.black, textAlign: "center" },
  lockedTextText: { fontFamily: Typography.fontBody, fontSize: Typography.size.xs, fontWeight: "700", color: "#6B7280" },
  
  settingsGroupCard: { backgroundColor: Colors.surface, borderRadius: Radii.md, borderWidth: 3, borderColor: Colors.border, ...Shadows.hardMd, marginTop: Spacing.md, overflow: "hidden" },
  settingsRowInteractive: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: Spacing.base, borderBottomWidth: 2, borderBottomColor: Colors.border },
  settingsRowText: { fontFamily: Typography.fontBody, fontSize: Typography.size.base, fontWeight: "800", color: Colors.text },
  settingsRowArrowPointer: { fontFamily: Typography.fontBody, fontSize: Typography.size.base, fontWeight: "900", color: Colors.textGhost },
  
  logoutBtnAction: { backgroundColor: Colors.secondary, borderRadius: Radii.md, padding: Spacing.md, alignItems: "center", borderWidth: 3, borderColor: Colors.border, ...Shadows.hardSm, marginTop: Spacing.xl },
  logoutBtnActionText: { fontFamily: Typography.fontBody, fontSize: Typography.size.base, fontWeight: "900", color: Colors.black, letterSpacing: 1 },
});