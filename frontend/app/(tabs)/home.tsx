import React, { useEffect, useMemo } from "react";
import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography, Spacing, LightColors, DarkColors } from "../../theme/theme";
import { useThemeStore } from "@/store/useThemeStore";
import HomeHeader from "../../components/home/HomeHeader";
import StreakBanner from "../../components/home/StreakBanner";
import DeckGrid from "../../components/home/DeckGrid";
import TodaySessionCard from "../../components/home/TodaySessionCard";
import { useProfileEngine } from "@/hooks/useProfileEngine";

export default function Home() {
  // ✅ All hooks inside the component — never at module level
  const darkMode = useThemeStore((s) => s.darkMode);
  const Colors = darkMode ? DarkColors : LightColors;
  const { profile, loading, syncProfileData } = useProfileEngine();

  // ✅ useMemo with primitive [darkMode] dep — stable across renders
  const styles = useMemo(() => makeStyles(Colors), [darkMode]);

  useEffect(() => {
    if (syncProfileData) syncProfileData();
  }, [syncProfileData]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeContainer, styles.centerWrapper]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const activeUsername = profile?.username || "Learner";
  const activeStreak = profile?.streak ?? 0;
  const cardsReviewedToday = profile?.cards_studied_today ?? 0;
  const accuracy = profile ? Math.round(profile.correct_answers_ratio * 100) : 0;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <HomeHeader
          name={activeUsername.toUpperCase()}
          subtitle={
            activeStreak > 0
              ? "You're on a roll today! 🔥"
              : "Ready to start a new learning streak?"
          }
        />

        <StreakBanner
          streakDays={activeStreak}
          bestDays={activeStreak > 21 ? activeStreak : 3}
        />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>📚 Your Decks</Text>
        </View>
        <DeckGrid />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>⚡ Today's Session</Text>
        </View>
        <TodaySessionCard cardsStudied={cardsReviewedToday} accuracyRate={accuracy} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ✅ Factory function — called inside component via useMemo, never at module level
const makeStyles = (Colors: typeof LightColors) =>
  StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: Colors.bg },
    container: { paddingHorizontal: Spacing.base, paddingTop: Spacing.xl, paddingBottom: 120 },
    centerWrapper: { justifyContent: "center", alignItems: "center" },
    sectionRow: { marginTop: Spacing.xl, marginBottom: Spacing.sm },
    sectionTitle: {
      fontFamily: Typography.fontBody,
      fontSize: Typography.size.md,
      fontWeight: "900",
      color: Colors.text,
    },
  });