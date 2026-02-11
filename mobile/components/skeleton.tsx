import { COLORS } from "@/constants/colors";
import { useEffect, useRef } from "react";
import { Animated, DimensionValue, View, ViewStyle } from "react-native";

interface SkeletonProps {
  height?: DimensionValue;
  width?: DimensionValue;
  style?: ViewStyle;
  count?: number;
  borderRadius?: number;
  baseColor?: string;
  highlightColor?: string;
}

export const Skeleton = ({
  height = 14,
  width = "100%",
  style = {},
  count = 1,
  borderRadius = 5,
  baseColor = COLORS.card,
  highlightColor = COLORS.border,
}: SkeletonProps) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim]);

  const animatedColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [baseColor, highlightColor],
  });

  const skeletonStyle: ViewStyle = {
    height: typeof height === "string" ? height : height,
    width: typeof width === "string" ? width : width,
    borderRadius,
    ...style,
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <Animated.View
      key={index}
      style={[
        skeletonStyle,
        { backgroundColor: animatedColor },
        index > 0 && { marginTop: 8 },
      ]}
    />
  ));

  return <View>{skeletons}</View>;
};
