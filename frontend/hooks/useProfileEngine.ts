import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export type UserProfileData = {
  username: string;
  join_year: number;
  streak: number;
  total_cards_studied: number;
  total_decks_created: number;
  correct_answers_ratio: number;
};

export type AchievementItem = {
  icon: string;
  label: string;
  key: "streak" | "cards" | "accuracy";
  threshold: number;
  color: string;
};

const API_BASE_URL = "https://mahima4569-synapse-backend.hf.space";

const REWARDS_METRICS_SCHEMA: AchievementItem[] = [
  { icon: "🔥", label: "7-Day Streak", key: "streak", threshold: 7, color: "#FFD60A" },
  { icon: "🧠", label: "100 Cards", key: "cards", threshold: 100, color: "#8A4FFF" },
  { icon: "🏆", label: "Top Accuracy", key: "accuracy", threshold: 85, color: "#FF4D6D" },
];

export function useProfileEngine() {
  const token = useAuthStore((s) => s.token);
  const logoutAction = useAuthStore((s) => s.logout);

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const syncProfileData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Could not load database metrics.");
      const data = await response.json();

      setProfile({
        username: data.username,
        join_year: data.join_year,
        streak: data.streak,
        total_cards_studied: data.total_cards_studied,
        total_decks_created: data.total_decks_created,
        correct_answers_ratio: data.correct_answers_ratio,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to stream account state metadata summary profile.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    syncProfileData();
  }, [syncProfileData]);

  // Gamification Loop: Dynamic progression level calculation structure
  const currentLevel = useMemo(() => {
    if (!profile) return 1;
    const experiencePoints = profile.total_cards_studied + (profile.total_decks_created * 15);
    return Math.max(1, Math.floor(experiencePoints / 40) + 1);
  }, [profile]);

  // Processes raw achievement values to toggle locked states instantly
  const computedBadges = useMemo(() => {
    if (!profile) return REWARDS_METRICS_SCHEMA.map(item => ({ ...item, unlocked: false }));

    return REWARDS_METRICS_SCHEMA.map((badge) => {
      let isUnlocked = false;
      if (badge.key === "streak") isUnlocked = profile.streak >= badge.threshold;
      else if (badge.key === "cards") isUnlocked = profile.total_cards_studied >= badge.threshold;
      else if (badge.key === "accuracy") isUnlocked = (profile.correct_answers_ratio * 100) >= badge.threshold;

      return {
        icon: badge.icon,
        label: badge.label,
        color: badge.color,
        unlocked: isUnlocked,
      };
    });
  }, [profile]);

  return {
    profile,
    loading,
    error,
    currentLevel,
    achievements: computedBadges,
    logout: logoutAction,
  };
}