import { StyleSheet, ViewStyle, TextStyle } from "react-native";

/**
 * Synapse — Global Design System
 * Aesthetic: Neubrutalist
 *
 * Bold, high-contrast, sharp edges, thick borders, hard shadows.
 */

export const Colors = {
  // Background + surfaces
  bg: "#F8F8F8",
  surface: "#FFFFFF",
  surfaceAlt: "#F2F2F2",

  // Borders + text
  border: "#111111",
  text: "#111111",
  textMuted: "#444444",
  textGhost: "#777777",

  // Accent colors (neon-ish but controlled)
  primary: "#00E0A4", // mint neon
  primaryDark: "#00A87C",
  secondary: "#FF4D6D", // hot pink-red
  secondaryDark: "#C8304A",

  yellow: "#FFD60A",
  blue: "#4D96FF",
  purple: "#8A4FFF",

  // Semantic
  success: "#00E0A4",
  warning: "#FFD60A",
  error: "#FF4D6D",
  info: "#4D96FF",

  // Absolute
  white: "#FFFFFF",
  black: "#111111",
  transparent: "transparent",
};

export const Typography = {
  // Neubrutalism looks best with strong sans fonts
  fontDisplay: "ArchivoBlack-Regular",
  fontBody: "Lexend-Medium",
  fontBold: "Lexend-Bold",


  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 18,
    lg: 22,
    xl: 28,
    "2xl": 34,
    "3xl": 42,
    display: 56,
  },

  leading: {
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
  },

  tracking: {
    tight: -0.8,
    normal: 0,
    wide: 0.8,
    wider: 1.4,
    caps: 2,
  },
};

export const Spacing = {
  xxs: 4,
  xs: 6,
  sm: 10,
  md: 14,
  base: 18,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 56,
  "4xl": 72,
  "5xl": 96,
  section: 120,
};

export const Radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  "2xl": 24,
  pill: 9999,
  circle: 9999,
};

// Hard brutal shadows
export const Shadows = {
  hardSm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  hardMd: {
    shadowColor: Colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  hardLg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 16,
  },
};

type GlobalStyleSheet = {
  screen: ViewStyle;
  scrollContent: ViewStyle;

  card: ViewStyle;
  cardAlt: ViewStyle;

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
    backgroundColor: Colors.bg,
  },

  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing["4xl"],
    paddingTop: Spacing.xl,
  },

  // Cards = thick border + hard shadow
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.base,
    marginTop: Spacing.base,

    // --- THE NEUBRUTALIST ADDITIONS ---
    borderColor: Colors.black, // Ensure this is pure black
    borderWidth: 3,            // The main "outline" thickness

    // These two lines create the "Hard Shadow" look on Android & iOS
    borderRightWidth: 6,
    borderBottomWidth: 6,
  },

  cardAlt: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.base,
    marginTop: Spacing.base,

    // --- THE NEUBRUTALIST ADDITIONS ---
    borderColor: Colors.black, // Ensure this is pure black
    borderWidth: 3,            // The main "outline" thickness

    // These two lines create the "Hard Shadow" look on Android & iOS
    borderRightWidth: 6,
    borderBottomWidth: 6,
  },

  heading1: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size["2xl"],
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: Typography.tracking.tight,
  },

  heading2: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size.xl,
    fontWeight: "900",
    color: Colors.text,
    letterSpacing: Typography.tracking.tight,
  },

  heading3: {
    fontFamily: Typography.fontDisplay,
    fontSize: Typography.size.lg,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: Typography.tracking.tight,
  },

  body: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    lineHeight: Typography.size.base * Typography.leading.normal,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },

  bodySmall: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    color: Colors.textGhost,
    marginTop: Spacing.xs,
  },

  label: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.sm,
    fontWeight: "800",
    color: Colors.text,
    textTransform: "uppercase",
    letterSpacing: Typography.tracking.caps,
    marginBottom: Spacing.xs,
  },

  // Buttons = thick border + brutal shadow
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.base,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardMd,
  },

  btnPrimaryText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "900",
    color: Colors.black,
    textTransform: "uppercase",
    letterSpacing: Typography.tracking.wider,
  },

  btnSecondary: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    marginTop: Spacing.sm,
    borderWidth: 3,
    borderColor: Colors.border,
    ...Shadows.hardSm,
  },

  btnSecondaryText: {
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    fontWeight: "900",
    color: Colors.text,
    textTransform: "uppercase",
    letterSpacing: Typography.tracking.wider,
  },

  // Inputs = boxy + thick border
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontFamily: Typography.fontBody,
    fontSize: Typography.size.base,
    color: Colors.text,
    borderWidth: 3,
    borderColor: Colors.border,
    marginTop: Spacing.base,
    ...Shadows.hardSm,
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