import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect, useState } from "react";

const ACHIEVEMENTS = [
  { icon: "🔥", label: "7-Day Streak", unlocked: true, color: Colors.secondary },
  { icon: "🧠", label: "100 Cards", unlocked: true, color: Colors.purple },
  { icon: "⚡", label: "Speed Learner", unlocked: false, color: Colors.yellow },
  { icon: "🏆", label: "Top Student", unlocked: false, color: Colors.primary },
];

export default function Profile() {
  const logout = useAuthStore((s) => s.logout);
  const token = useAuthStore((s) => s.token);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/me/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setUserName(data.username);
      })
      .catch(console.error);
  }, [token]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>PROFILE</Text>

        {/* Avatar Card */}
        <View style={[styles.avatarCard, { backgroundColor: Colors.yellow }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧑‍🎓</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userTagline}>Synapse learner since 2024</Text>

            <View style={styles.levelPill}>
              <Text style={styles.levelText}>⭐ LEVEL 4</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { label: "Streak", value: "6🔥", color: Colors.secondary },
            { label: "Cards", value: "142", color: Colors.purple },
            { label: "Decks", value: "4", color: Colors.primary },
            { label: "Accuracy", value: "87%", color: Colors.yellow },
          ].map((s, i) => (
            <View key={i} style={[styles.statBox, { backgroundColor: s.color }]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>🏆 Achievements</Text>

        <View style={styles.achieveGrid}>
          {ACHIEVEMENTS.map((a, i) => (
            <View
              key={i}
              style={[
                styles.achieveBox,
                {
                  backgroundColor: a.unlocked ? a.color : Colors.surfaceAlt,
                  opacity: a.unlocked ? 1 : 0.55,
                },
              ]}
            >
              <Text style={styles.achieveIcon}>{a.icon}</Text>
              <Text style={styles.achieveLabel}>{a.label}</Text>
              {!a.unlocked && <Text style={styles.lockedText}>🔒 Locked</Text>}
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>⚙️ Settings</Text>

        <View style={styles.settingsCard}>
          {["🔔 Notifications", "🌙 Dark Mode", "📤 Export Data", "❓ Help & Support"].map(
            (item, i) => (
              <TouchableOpacity key={i} style={styles.settingsRow}>
                <Text style={styles.settingsText}>{item}</Text>
                <Text style={styles.settingsArrow}>→</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            router.replace("/(auth)/login");
          }}
        >
          <Text style={styles.logoutText}>🚪 LOG OUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  container: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
  },

  title: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size["2xl"],
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: 2,
  },

  avatarCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.base,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardMd,
    marginTop: Spacing.base,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarEmoji: {
    fontSize: 32,
  },

  userName: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.lg,
    fontWeight: "900",
    color: Colors.black,
  },

  userTagline: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: Colors.textMuted,
    marginTop: 2,
  },

  levelPill: {
    marginTop: Spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: Colors.black,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 3,
    borderColor: Colors.border,
  },

  levelText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: 1,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  statBox: {
    width: "47%",
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
    alignItems: "center",
  },

  statValue: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xl,
    fontWeight: "900",
    color: Colors.black,
  },

  statLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "700",
    color: Colors.black,
    opacity: 0.75,
    marginTop: 2,
  },

  sectionTitle: {
    marginTop: Spacing.xl,
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.md,
    fontWeight: "900",
    color: Colors.text,
  },

  achieveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },

  achieveBox: {
    width: "47%",
    borderRadius: Radii.md,
    padding: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
    alignItems: "center",
    gap: Spacing.xs,
  },

  achieveIcon: {
    fontSize: 28,
  },

  achieveLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.black,
    textAlign: "center",
  },

  lockedText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "700",
    color: Colors.textMuted,
  },

  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardMd,
    marginTop: Spacing.md,
    overflow: "hidden",
  },

  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.base,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },

  settingsText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "800",
    color: Colors.text,
  },

  settingsArrow: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "900",
    color: Colors.textGhost,
  },

  logoutBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: Radii.md,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
    marginTop: Spacing.xl,
  },

  logoutText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1,
  },
});