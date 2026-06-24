import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Radii, Shadows, Typography, LightColors, DarkColors } from "../../theme/theme";
import { useThemeStore } from "@/store/useThemeStore";

export default function TabsLayout() {
  const darkMode = useThemeStore((s) => s.darkMode);
  const Colors = darkMode ? DarkColors : LightColors;

  // ✅ Memoized so Expo Router doesn't see a new object on every render
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.black,
      tabBarInactiveTintColor: Colors.textGhost,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopWidth: 3,
        borderColor: Colors.border,
        height: 74,
        paddingBottom: 10,
        paddingTop: 10,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: Radii.md,
        position: "absolute" as const,
        ...Shadows.hardMd,
      },
      tabBarLabelStyle: {
        fontSize: Typography.size.xs,
        fontWeight: "900" as const,
        letterSpacing: 1.2,
        textTransform: "uppercase" as const,
      },
      tabBarItemStyle: {
        borderRadius: Radii.sm,
        marginHorizontal: 6,
      },
      tabBarActiveBackgroundColor: Colors.primary,
    }),
    [darkMode] // ✅ only primitive dep, not the Colors object itself
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "cloud-upload" : "cloud-upload-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="decks"
        options={{
          title: "Decks",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "albums" : "albums-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}