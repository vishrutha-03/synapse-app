import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Colors, Typography, Spacing, Radii, Shadows } from "../theme/theme";

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  text: string;
  role: "bot" | "user";
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  tag: "upload" | "flashcard" | "ai" | "account";
};

// ─── Data ────────────────────────────────────────────────────────────────────

const FAQS: FAQ[] = [
  {
    id: "1",
    question: "What file types can I upload?",
    answer:
      "Synapse supports images (PNG, JPG, HEIC), PDFs, and plain text files. Just tap the Upload tab and select your file — the AI will process it automatically! 📂",
    tag: "upload",
  },
  {
    id: "2",
    question: "My file upload is failing. What should I do?",
    answer:
      "Check that your file is under 20MB and in a supported format. Try closing and reopening the app, then upload again. Still stuck? Try converting to PDF! 🔄",
    tag: "upload",
  },
  {
    id: "3",
    question: "How do I generate flashcards from my notes?",
    answer:
      "Upload your file via the Upload tab, wait a few seconds for processing, and flashcards will be auto-generated. Review and edit them from the Decks tab before studying! 🃏",
    tag: "flashcard",
  },
  {
    id: "4",
    question: "Can I edit or delete individual flashcards?",
    answer:
      "Yes! Open a deck, tap the ⋯ menu on any card, and choose Edit or Delete. Changes save automatically — no need to hit save! ✏️",
    tag: "flashcard",
  },
  {
    id: "5",
    question: "How do I delete a deck?",
    answer:
      "Go to Decks, tap the ⋯ menu on the deck card, and select Delete Deck. Heads up — this action is permanent and cannot be undone! 🗑️",
    tag: "flashcard",
  },
  {
    id: "6",
    question: "Why are my AI-generated cards sometimes inaccurate?",
    answer:
      "The AI does its best but can misread handwriting or complex diagrams. Always review generated cards and edit any that seem off. Higher quality images = better results! 📸",
    tag: "ai",
  },
  {
    id: "7",
    question: "Can I regenerate flashcards for the same file?",
    answer:
      "Yes! Open the deck, tap ⋯, and select Regenerate. Note this will replace your existing cards for that deck. Make sure to save any edits first! 🔁",
    tag: "ai",
  },
  {
    id: "8",
    question: "How do I reset my password?",
    answer:
      "On the Login screen, tap 'Forgot Password' and enter your email. You'll receive a reset link within a few minutes. Check your spam folder if it doesn't arrive! 📧",
    tag: "account",
  },
  {
    id: "9",
    question: "How do I export my data?",
    answer:
      "Go to Profile → Settings → Export Data. You'll get a JSON file with all your decks and cards that you can save or back up anywhere! 💾",
    tag: "account",
  },
  {
    id: "10",
    question: "How does the streak system work?",
    answer:
      "Your streak counts consecutive days you've studied at least one card. Miss a day and it resets to 0. Study every day to keep that 🔥 alive!",
    tag: "account",
  },
];

const TOPICS = [
  { id: "all", label: "ALL", emoji: "✨", color: Colors.text },
  { id: "upload", label: "Uploading", emoji: "📤", color: Colors.yellow },
  { id: "flashcard", label: "Flashcards", emoji: "🃏", color: Colors.primary },
  { id: "ai", label: "AI Magic", emoji: "🤖", color: Colors.purple },
  { id: "account", label: "Account", emoji: "👤", color: Colors.secondary },
];

const INITIAL_BOT_MESSAGE: Message = {
  id: "0",
  text: "Hey! 👋 I'm the Synapse support bot. Pick a question below and I'll help you out!",
  role: "bot",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function HelpSupportScreen() {
  const [activeTag, setActiveTag] = useState<string>("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const chatScrollRef = useRef<ScrollView>(null);

  const filteredFAQs =
    activeTag === "all" ? FAQS : FAQS.filter((f) => f.tag === activeTag);

  function toggleFAQ(id: string) {
    setExpandedFAQ((prev) => (prev === id ? null : id));
  }

  function handleQuestionTap(faq: FAQ) {
    if (isBotTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: faq.question,
      role: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsBotTyping(true);

    setTimeout(() => {
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: faq.answer,
        role: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HEADER ── */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.pageTitle}>❓ HELP & SUPPORT</Text>
          </View>

          {/* ── TOPIC FILTER CHIPS ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicRow}
          >
            {TOPICS.map((topic) => {
              const isActive = activeTag === topic.id;
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={[
                    styles.topicChip,
                    {
                      backgroundColor: isActive ? topic.color : Colors.surface,
                      borderColor: Colors.border,
                    },
                  ]}
                  onPress={() => setActiveTag(topic.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                  <Text
                    style={[
                      styles.topicLabel,
                      { color: isActive ? Colors.black : Colors.textMuted },
                    ]}
                  >
                    {topic.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── FAQ ACCORDION ── */}
          <Text style={styles.sectionLabel}>FREQUENTLY ASKED</Text>
          <View style={styles.faqList}>
            {filteredFAQs.map((faq) => {
              const isOpen = expandedFAQ === faq.id;
              return (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqQuestion}
                    onPress={() => toggleFAQ(faq.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                    <Text style={styles.faqChevron}>{isOpen ? "▲" : "▼"}</Text>
                  </TouchableOpacity>
                  {isOpen && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* ── CHATBOT ── */}
          <Text style={styles.sectionLabel}>💬 CHAT WITH SUPPORT BOT</Text>

          {/* Chat bubble area */}
          <View style={styles.chatBox}>
            <View style={styles.chatHeader}>
              <View style={styles.botAvatarBox}>
                <Text style={styles.botAvatarEmoji}>🤖</Text>
              </View>
              <View>
                <Text style={styles.botName}>Synapse Bot</Text>
                <Text style={styles.botStatus}>● Always online</Text>
              </View>
            </View>

            <ScrollView
              ref={chatScrollRef}
              style={styles.chatMessages}
              contentContainerStyle={styles.chatMessagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.msgRow,
                    msg.role === "user"
                      ? styles.msgRowUser
                      : styles.msgRowBot,
                  ]}
                >
                  <View
                    style={[
                      styles.msgBubble,
                      msg.role === "user"
                        ? styles.bubbleUser
                        : styles.bubbleBot,
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgText,
                        msg.role === "user"
                          ? styles.msgTextUser
                          : styles.msgTextBot,
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                </View>
              ))}

              {isBotTyping && (
                <View style={[styles.msgRow, styles.msgRowBot]}>
                  <View style={[styles.msgBubble, styles.bubbleBot]}>
                    <Text style={styles.typingDots}>• • •</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Quick question chips */}
            <View style={styles.quickRepliesWrapper}>
              <Text style={styles.quickRepliesLabel}>Tap a question to ask:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickRepliesRow}
              >
                {filteredFAQs.map((faq) => (
                  <TouchableOpacity
                    key={faq.id}
                    style={[
                      styles.quickChip,
                      isBotTyping && styles.quickChipDisabled,
                    ]}
                    onPress={() => handleQuestionTap(faq)}
                    activeOpacity={0.7}
                    disabled={isBotTyping}
                  >
                    <Text style={styles.quickChipText} numberOfLines={2}>
                      {faq.question}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* ── CONTACT FALLBACK ── */}
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Still stuck? 🙋</Text>
            <Text style={styles.contactBody}>
              Email us at{" "}
              <Text style={styles.contactEmail}>support@synapse.app</Text> — we
              usually reply within 24 hours.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: 120,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  backBtn: {
    width: 38,
    height: 38,
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 18,
    fontWeight: "900",
    color: Colors.text,
  },
  pageTitle: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size["xl"],
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: 1.5,
  },

  // Topic chips
  topicRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  topicChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 2.5,
    ...Shadows.hardSm,
  },
  topicEmoji: { fontSize: 14 },
  topicLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Section label
  sectionLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "900",
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },

  // FAQ
  faqList: { gap: Spacing.sm },
  faqItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 2.5,
    borderColor: Colors.border,
    ...Shadows.hardSm,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  faqQuestionText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "800",
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  faqChevron: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: "900",
  },
  faqAnswer: {
    padding: Spacing.base,
    paddingTop: 0,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
    paddingVertical: Spacing.sm,
  },
  faqAnswerText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: Colors.textMuted,
    lineHeight: 20,
  },

  // Chat box
  chatBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardMd,
    overflow: "hidden",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: Colors.yellow,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  botAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.black,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  botAvatarEmoji: { fontSize: 20 },
  botName: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.black,
  },
  botStatus: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "700",
    color: "#444",
  },
  chatMessages: {
    maxHeight: 260,
  },
  chatMessagesContent: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  msgRow: { flexDirection: "row" },
  msgRowBot: { justifyContent: "flex-start" },
  msgRowUser: { justifyContent: "flex-end" },
  msgBubble: {
    maxWidth: "80%",
    padding: Spacing.sm,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  bubbleBot: {
    backgroundColor: Colors.bg,
    borderBottomLeftRadius: 3,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 3,
  },
  msgText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    lineHeight: 19,
  },
  msgTextBot: { color: Colors.text },
  msgTextUser: { color: Colors.black },
  typingDots: {
    fontSize: 18,
    color: Colors.textMuted,
    letterSpacing: 3,
  },

  // Quick reply chips
  quickRepliesWrapper: {
    borderTopWidth: 2,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bg,
  },
  quickRepliesLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "800",
    color: Colors.textMuted,
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.sm,
    marginBottom: 8,
  },
  quickRepliesRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  quickChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 2.5,
    borderColor: Colors.border,
    ...Shadows.hardSm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    maxWidth: 160,
  },
  quickChipDisabled: { opacity: 0.4 },
  quickChipText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.xs,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 16,
  },

  // Contact fallback
  contactCard: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.purple,
    borderRadius: Radii.md,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardMd,
    padding: Spacing.base,
  },
  contactTitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "900",
    color: Colors.black,
    marginBottom: 6,
  },
  contactBody: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "600",
    color: Colors.black,
    lineHeight: 20,
  },
  contactEmail: {
    fontWeight: "900",
    textDecorationLine: "underline",
  },
});