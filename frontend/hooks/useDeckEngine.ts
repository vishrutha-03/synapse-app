import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";

export type Card = { id: string; question: string; answer: string };
export type Mode = "browse" | "study" | "quiz";
export type Rating = "easy" | "hard" | "got_it";
export type QuizOption = { text: string; correct: boolean };

const API = "http://127.0.0.1:8000";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuizOptions(cards: Card[], correctCard: Card): QuizOption[] {
  const distractors = shuffle(cards.filter((c) => c.id !== correctCard.id))
    .slice(0, 3)
    .map((c) => ({ text: c.answer, correct: false }));
  return shuffle([{ text: correctCard.answer, correct: true }, ...distractors]);
}

export function useDeckEngine(id: string, token: string | null) {
  const router = useRouter();

  // Core Data State
  const [cards, setCards] = useState<Card[]>([]);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("📚");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("browse");

  // Browse View State
  const [browseIndex, setBrowseIndex] = useState(0);
  const [isBrowseFlipped, setIsBrowseFlipped] = useState(false);

  // Active Revision / Study State
  const [studyQueue, setStudyQueue] = useState<Card[]>([]);
  const [studyIndex, setStudyIndex] = useState(0);
  const [studyFlipped, setStudyFlipped] = useState(false);
  const [studyDone, setStudyDone] = useState(false);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});

  // Quiz View State
  const [quizCards, setQuizCards] = useState<Card[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  // --- API Fetch ---
  const fetchDeck = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/decks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTitle(data.title);
      setEmoji(data.emoji ?? "📚");
      setCards(data.flashcards ?? []);
    } catch (e) {
      console.error("Failed to fetch deck", e);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  // --- Study Mode Handlers ---
  const startStudy = () => {
    setStudyQueue(shuffle(cards));
    setStudyIndex(0);
    setStudyFlipped(false);
    setStudyDone(false);
    setRatings({});
    setMode("study");
  };

  const rateCard = (rating: Rating) => {
    const card = studyQueue[studyIndex];
    setRatings((prev) => ({ ...prev, [card.id]: rating }));
    const next = studyIndex + 1;
    if (next >= studyQueue.length) {
      setStudyDone(true);
    } else {
      setStudyIndex(next);
      setStudyFlipped(false);
    }
  };

  const studySummary = useMemo(() => {
    const easy = Object.values(ratings).filter((r) => r === "easy").length;
    const gotIt = Object.values(ratings).filter((r) => r === "got_it").length;
    const hard = Object.values(ratings).filter((r) => r === "hard").length;
    return { easy, gotIt, hard };
  }, [ratings]);

  // --- Quiz Mode Handlers ---
  const startQuiz = () => {
    const shuffled = shuffle(cards);
    setQuizCards(shuffled);
    setQuizIndex(0);
    setQuizOptions(buildQuizOptions(cards, shuffled[0]));
    setQuizSelected(null);
    setQuizScore(0);
    setQuizDone(false);
    setMode("quiz");
  };

  const handleQuizSelect = (optionIndex: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(optionIndex);
    if (quizOptions[optionIndex].correct) {
      setQuizScore((s) => s + 1);
    }
  };

  const nextQuizCard = () => {
    const next = quizIndex + 1;
    if (next >= quizCards.length) {
      setQuizDone(true);
    } else {
      setQuizIndex(next);
      setQuizOptions(buildQuizOptions(cards, quizCards[next]));
      setQuizSelected(null);
    }
  };

  return {
    title, setTitle, emoji, setEmoji, cards, setCards, loading, mode, setMode,
    browseIndex, setBrowseIndex, isBrowseFlipped, setIsBrowseFlipped,
    studyQueue, studyIndex, studyFlipped, setStudyFlipped, studyDone, rateCard, studySummary, startStudy,
    quizCards, quizIndex, quizOptions, quizSelected, quizScore, quizDone, startQuiz, handleQuizSelect, nextQuizCard,
    API, router
  };
}