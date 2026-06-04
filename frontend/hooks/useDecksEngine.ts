import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export type Deck = {
  id: string;
  title: string;
  card_count: number;
  emoji: string;
  color: string;
};

export type FilterMode = "ALL" | "RECENT";

const API_BASE_URL = "https://synapse-app-backend.onrender.com";

export function useDecksEngine() {
  const token = useAuthStore((state) => state.token);
  const [activeFilter, setActiveFilter] = useState<FilterMode>("ALL");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/decks/`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      if (!response.ok) throw new Error("Could not load library folders.");
      const data = await response.json();
      setDecks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to sync collections library folder.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  // Mutation Handlers for direct UI synchronization updating state locally
  const updateDeckTitleInState = (deckId: string, newTitle: string) => {
    setDecks((prev) =>
      prev.map((d) => (d.id === deckId ? { ...d, title: newTitle } : d))
    );
  };

  const removeDeckFromState = (deckId: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  const metrics = useMemo(() => {
    const totalDecks = decks.length;
    const totalCards = decks.reduce((sum, d) => sum + (d.card_count ?? 0), 0);
    return { totalDecks, totalCards };
  }, [decks]);

  const filteredDecks = useMemo(() => {
    if (activeFilter === "RECENT") return [...decks].reverse();
    return decks;
  }, [decks, activeFilter]);

  return {
    decks: filteredDecks,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    metrics,
    API_BASE_URL,
    token,
    updateDeckTitleInState,
    removeDeckFromState
  };
}