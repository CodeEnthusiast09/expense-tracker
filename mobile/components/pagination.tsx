import { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { Pagination as PaginationType } from "@/interfaces";

interface PaginationProps {
  pagination: PaginationType;
  onPaginate: (page: number) => void;
}

export const Pagination = ({ pagination, onPaginate }: PaginationProps) => {
  const { total = 0, perPage = 1, currentPage = 1, hasMorePages } = pagination;
  const totalPages = useMemo(
    () => Math.ceil(total / perPage),
    [total, perPage],
  );

  const renderPageButtons = useMemo(() => {
    if (totalPages <= 1) return [];

    const pagesToShow: (number | string)[] = [];

    // Show first page
    pagesToShow.push(1);

    // Show second page if there are at least 2 pages
    if (totalPages >= 2) {
      pagesToShow.push(2);
    }

    // Add ellipsis if currentPage is beyond 3
    if (currentPage > 3) {
      pagesToShow.push("ellipsis-1");
    }

    // Add pages around the current one
    for (
      let i = Math.max(3, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages - 2);
      i++
    ) {
      pagesToShow.push(i);
    }

    // Add ellipsis if the current page is far from the last 2
    if (currentPage < totalPages - 2) {
      pagesToShow.push("ellipsis-2");
    }

    // Show last two pages only if totalPages > 3
    if (totalPages > 3) {
      if (totalPages - 1 > 2) pagesToShow.push(totalPages - 1);
      pagesToShow.push(totalPages);
    }

    return pagesToShow;
  }, [totalPages, currentPage]);

  const handleEllipsisClick = (type: string) => {
    if (type === "ellipsis-1") {
      onPaginate(Math.max(currentPage - 3, 3));
    } else if (type === "ellipsis-2") {
      onPaginate(Math.min(currentPage + 3, totalPages - 2));
    }
  };

  if (total <= perPage) return null;

  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.navButton,
          currentPage === 1 && styles.disabledButton,
          pressed && currentPage !== 1 && styles.pressedButton,
        ]}
        onPress={() => onPaginate(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        {({ pressed }) => (
          <>
            <Ionicons
              name="chevron-back"
              size={18}
              color={
                currentPage === 1
                  ? COLORS.textLight
                  : pressed
                    ? COLORS.white
                    : COLORS.text
              }
            />
            <Text
              style={[
                styles.navButtonText,
                currentPage === 1 && styles.disabledText,
                pressed && currentPage !== 1 && styles.pressedText,
              ]}
            >
              Previous
            </Text>
          </>
        )}
      </Pressable>

      {/* Page Numbers */}
      <View style={styles.pageNumbersContainer}>
        {renderPageButtons.map((page, index) =>
          typeof page === "number" ? (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.button,
                styles.pageButton,
                currentPage === page && styles.activeButton,
                pressed && currentPage !== page && styles.pressedButton,
              ]}
              onPress={() => onPaginate(page)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    styles.pageButtonText,
                    currentPage === page && styles.activeText,
                    pressed && currentPage !== page && styles.pressedText,
                  ]}
                >
                  {page}
                </Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              key={index}
              style={styles.ellipsisButton}
              onPress={() => handleEllipsisClick(page)}
            >
              <Text style={styles.ellipsisText}>...</Text>
            </Pressable>
          ),
        )}
      </View>

      {/* Next Button */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.navButton,
          !hasMorePages && styles.disabledButton,
          pressed && hasMorePages && styles.pressedButton,
        ]}
        onPress={() => onPaginate(Math.min(currentPage + 1, totalPages))}
        disabled={!hasMorePages}
      >
        {({ pressed }) => (
          <>
            <Text
              style={[
                styles.navButtonText,
                !hasMorePages && styles.disabledText,
                pressed && hasMorePages && styles.pressedText,
              ]}
            >
              Next
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={
                !hasMorePages
                  ? COLORS.textLight
                  : pressed
                    ? COLORS.white
                    : COLORS.text
              }
            />
          </>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    flexWrap: "wrap",
  },
  button: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    minWidth: 40,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 4,
  },
  pageButton: {
    paddingHorizontal: 4,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pressedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  ellipsisButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  activeText: {
    color: COLORS.white,
  },
  disabledText: {
    color: COLORS.textLight,
  },
  pressedText: {
    color: COLORS.white,
  },
  ellipsisText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  pageNumbersContainer: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
    alignItems: "center",
  },
});
