import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radii, Shadows, Typography } from "../../theme/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
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

          position: "absolute",

          ...Shadows.hardMd,
        },

        tabBarLabelStyle: {
          fontSize: Typography.size.xs,
          fontWeight: "900",
          letterSpacing: 1.2,
          textTransform: "uppercase",
        },

        tabBarItemStyle: {
          borderRadius: Radii.sm,
          marginHorizontal: 6,
        },

        tabBarActiveBackgroundColor: Colors.primary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cloud-upload" : "cloud-upload-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="decks"
        options={{
          title: "Decks",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "albums" : "albums-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}