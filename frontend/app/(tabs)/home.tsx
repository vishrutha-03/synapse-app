import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Typography, Spacing } from "../../theme/theme";

import HomeHeader from "../../components/home/HomeHeader";
import StreakBanner from "../../components/home/StreakBanner";
import DeckGrid from "../../components/home/DeckGrid";
import TodaySessionCard from "../../components/home/TodaySessionCard";

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <HomeHeader name="Mahima" subtitle="You're on a roll today" />
        <StreakBanner streakDays={12} bestDays={21} />
      

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>📚 Your decks</Text>
        </View>

        

        <DeckGrid />

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>⚡ Today's session</Text>
        </View>

        <TodaySessionCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
  },

  sectionRow: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },

  sectionTitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.md,
    fontWeight: "900",
    color: Colors.text,
  },
});