import SafeScreen from "@/components/safe-screen";
import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { COLORS } from "@/constants/colors";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen backgroundColor={COLORS.background}>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
