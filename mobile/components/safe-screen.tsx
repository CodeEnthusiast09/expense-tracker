import { useTheme } from "@/hooks/common";
import { SafeScreenProps } from "@/interfaces/safe-screen";
import React, { PropsWithChildren } from "react";
import { ScrollView, ViewStyle, StyleProp } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeScreen = ({
  children,
  edges = ["top", "bottom", "left", "right"],
  style,
  backgroundColor,
  scrollable = false,
  scrollViewProps,
  showsVerticalScrollIndicator = false,
}: PropsWithChildren<SafeScreenProps>) => {
  const containerStyle: StyleProp<ViewStyle> = {
    flex: 1,
    ...(backgroundColor && { backgroundColor }),
  };

  if (scrollable) {
    return (
      <SafeAreaView style={[containerStyle, style]} edges={edges}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[containerStyle, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

export default SafeScreen;

export const SafeScreenWithTabs = (
  props: PropsWithChildren<Omit<SafeScreenProps, "edges">>,
) => <SafeScreen edges={["top", "left", "right"]} {...props} />;

export const FullScreenSafe = (
  props: PropsWithChildren<Omit<SafeScreenProps, "edges">>,
) => <SafeScreen edges={[]} {...props} />;

export const ThemedSafeScreen = (props: PropsWithChildren<SafeScreenProps>) => {
  const { colors } = useTheme();
  return <SafeScreen backgroundColor={colors.bg} {...props} />;
};
