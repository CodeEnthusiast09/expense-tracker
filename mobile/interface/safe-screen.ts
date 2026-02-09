import { ScrollView, StyleProp, ViewStyle } from "react-native";
import { Edge } from "react-native-safe-area-context";

export interface SafeScreenProps {
  /**
   * Which edges to apply safe area padding to.
   * Default: all edges ["top", "bottom", "left", "right"]
   */
  edges?: Edge[];

  /**
   * Custom styles for the container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Background color for the screen
   */
  backgroundColor?: string;

  /**
   * Whether the content should be scrollable
   * Default: false
   */
  scrollable?: boolean;

  /**
   * Additional props for ScrollView (only used if scrollable=true)
   */
  scrollViewProps?: React.ComponentProps<typeof ScrollView>;

  /**
   * Whether to show the scroll indicator
   * Default: false
   */
  showsVerticalScrollIndicator?: boolean;
}
