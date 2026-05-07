import { StyleSheet, ViewStyle, TextStyle } from "react-native";

/**
 * Synapse — Global Design System
 * Aesthetic: Warm Cottagecore
 */

export const Colors = {
  cream: "#FDF5E6",
  creamDeep: "#F5E6C8",
  creamDark: "#EDD9A3",

  sage: "#87A96B",
  sageDark: "#6A8A52",
  sageLight: "#B8CFA2",
  sageMist: "#E8F0E1",

  clay: "#B36751",
  clayDark: "#8F4F3C",
  clayLight: "#D4A090",
  clayMist: "#F5EAE7",

  inkDark: "#3B2F2F",
  inkMid: "#6B5555",
  inkLight: "#A08080",
  inkGhost: "#C8B4B4",

  success: "#87A96B",
  warning: "#D4A900",
  error: "#B36751",
  info: "#7B9EA8",

  white: "#FFFFFF",
  black: "#1A1010",
  transparent: "transparent",
};

export const Typography = {
  fontSerif: "Lora-Regular",
  fontSerifSemiBold: "Lora-SemiBold",
  fontSerifItalic: "Lora-Italic",

  fontSans: "Nunito-Regular",
  fontSansMedium: "Nunito-Medium",
  fontSansSemiBold: "Nunito-SemiBold",

  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    "2xl": 30,
    "3xl": 38,
    display: 48,
  },

  leading: {
    tight: 1.2,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.8,
  },

  tracking: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    caps: 2,
  },
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 56,
  "5xl": 72,
  section: 96,
};

export const Radii = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  "2xl": 48,
  pill: 9999,
  circle: 9999,
};

export const Shadows = {
  xs: {
    shadowColor: Colors.clay,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  sm: {
    shadowColor: Colors.inkDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.inkDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.clay,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

type GlobalStyleSheet = {
  screen: ViewStyle;
  scrollContent: ViewStyle;

  card: ViewStyle;
  cardFlat: ViewStyle;
  cardAccent: ViewStyle;

  heading1: TextStyle;
  heading2: TextStyle;
  heading3: TextStyle;

  body: TextStyle;
  bodySmall: TextStyle;
  label: TextStyle;

  btnPrimary: ViewStyle;
  btnPrimaryText: TextStyle;

  btnSecondary: ViewStyle;
  btnSecondaryText: TextStyle;

  input: TextStyle;
};

export const GlobalStyles = StyleSheet.create<GlobalStyleSheet>({
  screen: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing["4xl"],
    paddingTop: Spacing.lg,
  },

  card: {
    backgroundColor: Colors.creamDeep,
    borderRadius: Radii.lg,
    padding: Spacing.base,
    ...Shadows.md,
    marginTop: Spacing.base,
  },
  cardFlat: {
    backgroundColor: Colors.creamDeep,
    borderRadius: Radii.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.creamDark,
    marginTop: Spacing.base,
  },
  cardAccent: {
    backgroundColor: Colors.sageMist,
    borderRadius: Radii.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.sage + "40",
    ...Shadows.sm,
    marginTop: Spacing.base,
  },

  heading1: {
    fontFamily: Typography.fontSerifSemiBold,
    fontSize: Typography.size["2xl"],
    color: Colors.inkDark,
  },
  heading2: {
    fontFamily: Typography.fontSerifSemiBold,
    fontSize: Typography.size.xl,
    color: Colors.inkDark,
  },
  heading3: {
    fontFamily: Typography.fontSerifSemiBold,
    fontSize: Typography.size.lg,
    color: Colors.inkDark,
  },

  body: {
    fontFamily: Typography.fontSans,
    fontSize: Typography.size.base,
    lineHeight: Typography.size.base * Typography.leading.relaxed,
    color: Colors.inkMid,
    marginTop: 6,
  },
  bodySmall: {
    fontFamily: Typography.fontSans,
    fontSize: Typography.size.sm,
    color: Colors.inkLight,
    marginTop: 4,
  },
  label: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: Typography.size.sm,
    color: Colors.inkDark,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  btnPrimary: {
    backgroundColor: Colors.sage,
    borderRadius: Radii.pill,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.base,
    ...Shadows.sm,
  },
  btnPrimaryText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: Typography.size.base,
    color: Colors.white,
  },

  btnSecondary: {
    borderRadius: Radii.pill,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.sage,
  },
  btnSecondaryText: {
    fontFamily: Typography.fontSansSemiBold,
    fontSize: Typography.size.base,
    color: Colors.sageDark,
  },

  input: {
    backgroundColor: Colors.white,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontSans,
    fontSize: Typography.size.base,
    color: Colors.inkDark,
    borderWidth: 1.5,
    borderColor: Colors.creamDark,
    marginTop: Spacing.base,
  },
});

const theme = {
  Colors,
  Typography,
  Spacing,
  Radii,
  Shadows,
  GlobalStyles,
};

export default theme;