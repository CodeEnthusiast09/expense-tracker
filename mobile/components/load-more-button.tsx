import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface LoadMoreButtonProps {
  /** Total number of items across all pages */
  totalItems: number;
  /** Number of items currently loaded */
  loadedItems: number;
  /** Whether data is currently being fetched */
  isLoading: boolean;
  /** Callback when button is pressed */
  onLoadMore: () => void;
}

export const LoadMoreButton = ({
  totalItems,
  loadedItems,
  isLoading,
  onLoadMore,
}: LoadMoreButtonProps) => {
  // Calculate remaining items
  const remainingItems = totalItems - loadedItems;

  // Don't show button if all items are loaded
  if (remainingItems <= 0) return null;

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && !isLoading && styles.buttonPressed,
          isLoading && styles.buttonLoading,
        ]}
        onPress={onLoadMore}
        disabled={isLoading}
      >
        {({ pressed }) => (
          <>
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color={COLORS.white} />
                <Text style={styles.buttonText}>Loading...</Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="chevron-down-circle-outline"
                  size={20}
                  color={pressed ? COLORS.white : COLORS.white}
                />
                <Text style={styles.buttonText}>
                  Load More ({remainingItems} remaining)
                </Text>
              </>
            )}
          </>
        )}
      </Pressable>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Showing {loadedItems} of {totalItems} transactions
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(loadedItems / totalItems) * 100}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 0.98 }],
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    gap: 6,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});
