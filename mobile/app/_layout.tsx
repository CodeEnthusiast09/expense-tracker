import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";

// Slot works like Outlet in react-router
// StatusBar is to change the theme of status bar from light to dark and vice versa

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}
