import { useState } from "react";
import {
  Pressable, Text, ActivityIndicator,
  View, TextInput, TouchableOpacity, StyleSheet
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { GlobalStyles, Colors, Typography, Spacing, Radii, Shadows } from "../theme/theme";
import { useAuthStore } from "../store/useAuthStore";
import SummaryView from "./SummaryView";

type Mode = "pdf" | "text";

export default function UploadZone() {
  const token = useAuthStore((s) => s.token);
  const [mode, setMode] = useState<Mode>("pdf");
  const [loading, setLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setSummary(null);
    setError(null);
  };

  const uploadPdf = async () => {
    const picked = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (picked.canceled) return;

    const file = picked.assets[0];
    setLoading(true);
    reset();

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: "application/pdf",
      } as any);

      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) setSummary(data.summary);
      else setError(data.detail || "Upload failed.");
    } catch (e) {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const uploadText = async () => {
    if (!textInput.trim()) {
      setError("Please enter some text first.");
      return;
    }

    setLoading(true);
    reset();

    try {
      const formData = new FormData();
      formData.append("raw_text", textInput.trim());

      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) setSummary(data.summary);
      else setError(data.detail || "Upload failed.");
    } catch (e) {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Mode Toggle */}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === "pdf" && styles.toggleActive]}
          onPress={() => { setMode("pdf"); reset(); }}
        >
          <Text style={[styles.toggleText, mode === "pdf" && styles.toggleTextActive]}>
            📄 PDF
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === "text" && styles.toggleActive]}
          onPress={() => { setMode("text"); reset(); }}
        >
          <Text style={[styles.toggleText, mode === "text" && styles.toggleTextActive]}>
            📝 TEXT
          </Text>
        </TouchableOpacity>
      </View>

      {/* PDF Upload */}
      {mode === "pdf" && (
        <Pressable
          style={GlobalStyles.card}
          onPress={uploadPdf}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <>
              <Text style={GlobalStyles.heading3}>📄 Upload Lecture PDF</Text>
              <Text style={GlobalStyles.bodySmall}>
                Tap to select a PDF — Synapse will generate a summary and flashcards
              </Text>
            </>
          )}
        </Pressable>
      )}

      {/* Text Input */}
      {mode === "text" && (
        <View style={styles.textBox}>
          <TextInput
            style={styles.textInput}
            placeholder="Paste your lecture notes here..."
            placeholderTextColor={Colors.textMuted}
            multiline
            value={textInput}
            onChangeText={setTextInput}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={uploadText}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.black} />
            ) : (
              <Text style={styles.submitText}>⚡ GENERATE</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Error */}
      {error && (
        <Text style={styles.errorText}>❌ {error}</Text>
      )}

      {/* Summary */}
      {summary && <SummaryView summary={summary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    marginBottom: Spacing.base,
    borderWidth: 3,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    overflow: "hidden",
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  toggleActive: {
    backgroundColor: Colors.black,
  },
  toggleText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: 1,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  textBox: {
    borderWidth: 3,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    ...Shadows.hardSm,
    padding: Spacing.base,
    gap: Spacing.base,
  },
  textInput: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    color: Colors.text,
    minHeight: 160,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
  },
  submitText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.black,
    letterSpacing: 1,
  },
  errorText: {
    color: "red",
    fontWeight: "700",
    marginTop: Spacing.sm,
  },
});