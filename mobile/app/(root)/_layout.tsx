import SafeScreen, { SafeScreenWithTabs } from "@/components/safe-screen";
import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "@/constants/colors";
import { ProviderWrappers } from "@/components/provider-wrappers";

export default function Layout() {
  const { isSignedIn, isLoaded } = useUser();

  // Better loading UX
  if (!isLoaded) {
    return (
      <SafeScreen backgroundColor={COLORS.background}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (!isSignedIn) return <Redirect href="/sign-in" />;

  return (
    <ProviderWrappers>
      <SafeScreenWithTabs backgroundColor={COLORS.background}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeScreenWithTabs>
    </ProviderWrappers>
  );
}
