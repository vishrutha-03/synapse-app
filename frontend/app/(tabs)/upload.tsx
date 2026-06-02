import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Colors, Typography, Spacing, Radii, Shadows } from "../../theme/theme";
import * as ImagePicker from "expo-image-picker";
import UploadZone from "../../components/UploadZone";
import SummaryView from "../../components/SummaryView";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const METHODS = [
  { icon: "📄", label: "PDF Slides", color: Colors.yellow },
  { icon: "🖼️", label: "Image Scan", color: Colors.purple },
  { icon: "📝", label: "Text Paste", color: Colors.primary },
  { icon: "🔗", label: "URL Import", color: Colors.secondary },
];

export default function Upload() {
  const token = useAuthStore((s) => s.token);
  const [summary, setSummary] = useState("");
const [flashcards, setFlashcards] = useState<any[]>([]);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      uploadImages(result.assets);
    }
  };
 const uploadImages = async (assets: any[]) => {

  const formData = new FormData();

  assets.forEach((asset: any) => {

    formData.append(
      "file",
      asset.file
    );

  });

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/ai/upload-images",
      {
        method: "POST",

headers: {
  Authorization: `Bearer ${token}`,
},

body: formData,
      }
    );

    const data = await response.json();

    console.log(data);

setSummary(data.summary);
setFlashcards(data.flashcards);

    alert("Upload successful!");

  } catch (error) {

    console.log(error);

    alert("Upload failed");
  }
};
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>UPLOAD</Text>
        <Text style={styles.subtitle}>
          Drop your lecture slides and let Synapse do the rest.
        </Text>

        {/* Method Selector */}
        <View style={styles.methodGrid}>
          {METHODS.map((m, i) => (
            <TouchableOpacity
  key={i}
  style={[styles.methodCard, { backgroundColor: m.color }]}
  onPress={() => {
    if (m.label === "Image Scan") {
      pickImage();
    }
  }}
>
              <Text style={styles.methodIcon}>{m.icon}</Text>
              <Text style={styles.methodLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload Zone */}
        <View style={{ marginTop: Spacing.base }}>
          <UploadZone />
        </View>


        {/* Output Card */}
        {summary ? (
  <View style={styles.outputCard}>
    <Text style={styles.outputTitle}>SUMMARY</Text>

    <Text style={styles.outputText}>
      {summary}
    </Text>
  </View>
) : null}

        <View style={styles.outputCard}>
          <Text style={styles.outputTitle}>WHAT YOU'LL GET</Text>

          {[
            { icon: "✨", text: "AI-generated summary" },
            { icon: "🃏", text: "Auto flashcard deck" },
            { icon: "🧪", text: "Practice quiz" },
            { icon: "🔑", text: "Key concepts extracted" },
          ].map((item, i) => (
            <View key={i} style={styles.outputRow}>
              <Text style={styles.outputIcon}>{item.icon}</Text>
              <Text style={styles.outputText}>{item.text}</Text>
            </View>
          ))}
        </View>
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

  subtitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "600",
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },

  methodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },

  methodCard: {
    width: "47%",
    borderRadius: Radii.md,
    padding: Spacing.base,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
    alignItems: "center",
    gap: Spacing.xs,
  },

  methodIcon: {
    fontSize: 28,
  },

  methodLabel: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.black,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  outputCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardMd,
    marginTop: Spacing.lg,
  },

  outputTitle: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },

  outputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },

  outputIcon: {
    fontSize: 20,
  },

  outputText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "700",
    color: Colors.textMuted,
  },
});