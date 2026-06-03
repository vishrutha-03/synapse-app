import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Animated, TouchableOpacity } from "react-native";
import { Colors, Typography, Spacing, Radii } from "../theme/theme";

type FlashcardData = {
  topic: string;
  question: string;
  answer: string;
  bgColor?: string;
};

type Props = {
  cardData: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
  onOptionsPress?: () => void; // Called when clicking the professional 3-dots
};

export default function Flashcard({ cardData, isFlipped, onFlip, onOptionsPress }: Props) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "-90deg", "-90deg"],
  });

  const backRotate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["90deg", "90deg", "0deg"],
  });

  const pressStyle = {
    borderRightWidth: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [7, 3] }),
    borderBottomWidth: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [7, 3] }),
    transform: [
      { translateX: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
      { translateY: pressAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 4] }) },
    ],
  };

  const bg = cardData.bgColor ?? Colors.yellow;

  return (
    <Pressable
      onPress={onFlip}
      onPressIn={() => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: false }).start()}
      onPressOut={() => Animated.spring(pressAnim, { toValue: 0, useNativeDriver: false }).start()}
    >
      <Animated.View style={[styles.card, { backgroundColor: bg }, pressStyle]}>
        
        {/* ── FRONT FACE ── */}
        <Animated.View
          pointerEvents={isFlipped ? "none" : "auto"}
          style={[styles.face, { transform: [{ rotateY: frontRotate }] }, isFlipped && styles.faceHidden]}
        >
          <View style={styles.topRow}>
            <View style={styles.topicBadge}>
              <Text style={styles.topicText}>{cardData.topic}</Text>
            </View>
            
            {onOptionsPress && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation(); // Prevents the card from flipping when managing options
                  onOptionsPress();
                }}
                style={styles.threeDotsBtn}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              >
                <Text style={styles.threeDotsText}>⋮</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.mainText}>{cardData.question}</Text>
          </View>

          <Text style={styles.tapHint}>tap to reveal answer</Text>
        </Animated.View>

        {/* ── BACK FACE ── */}
        <Animated.View
          pointerEvents={isFlipped ? "auto" : "none"}
          style={[styles.face, styles.backFace, { transform: [{ rotateY: backRotate }] }, !isFlipped && styles.faceHidden]}
        >
          <View style={styles.topRow}>
            <View style={[styles.topicBadge, { backgroundColor: "rgba(0,0,0,0.12)" }]}>
              <Text style={styles.topicText}>ANSWER</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.mainText}>{cardData.answer}</Text>
          </View>

          <Text style={styles.tapHint}>tap to flip back</Text>
        </Animated.View>
        
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", minHeight: 340, borderRadius: Radii.md, borderWidth: 3, borderColor: Colors.black, overflow: "hidden" },
  face: { ...StyleSheet.absoluteFillObject, padding: Spacing.lg, justifyContent: "space-between", backfaceVisibility: "hidden" },
  backFace: { backgroundColor: "transparent" },
  faceHidden: { opacity: 0 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", zIndex: 10 },
  topicBadge: { backgroundColor: "rgba(255,255,255,0.45)", borderRadius: Radii.pill, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderWidth: 2, borderColor: Colors.black },
  topicText: { fontFamily: Typography.fontBold, fontSize: Typography.size.xs, letterSpacing: 1, color: Colors.black },
  threeDotsBtn: { width: 32, height: 32, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.45)", borderWidth: 2, borderColor: Colors.black, borderRadius: Radii.pill },
  threeDotsText: { fontSize: 18, fontWeight: "bold", color: Colors.black, textAlign: "center", marginTop: -2 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: Spacing.sm, marginVertical: Spacing.md },
  mainText: { fontFamily: Typography.fontDisplay, fontSize: Typography.size.xl, textAlign: "center", color: Colors.black, lineHeight: 28 },
  tapHint: { fontFamily: Typography.fontBody, fontSize: Typography.size.sm, fontWeight: "700", color: Colors.black, opacity: 0.6, textAlign: "center", marginBottom: Spacing.xs },
});