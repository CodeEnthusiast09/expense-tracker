import { SafeScreenWithTabs } from "@/components/safe-screen";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { COLORS } from "@/constants/colors";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeScreenWithTabs backgroundColor={COLORS.background}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeScreenWithTabs>
  );
}
