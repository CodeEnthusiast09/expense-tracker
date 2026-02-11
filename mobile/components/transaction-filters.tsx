import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface FilterOptions {
  category: string;
  year: number | "";
  month: string;
  order: "asc" | "desc";
}

interface TransactionFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onClearAll: () => void;
}

const CATEGORIES = [
  { label: "All Categories", value: "" },
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

const MONTHS = [
  { label: "All Months", value: "" },
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

// Generate last 5 years
const currentYear = new Date().getFullYear();
const YEARS = [
  { label: "All Years", value: "" },
  ...Array.from({ length: 5 }, (_, i) => ({
    label: String(currentYear - i),
    value: currentYear - i,
  })),
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
];

export const TransactionFilters = ({
  filters,
  onFilterChange,
  onClearAll,
}: TransactionFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count active filters (exclude order as it's not really a "filter")
  const activeFilterCount = [
    filters.category,
    filters.year,
    filters.month,
  ].filter(Boolean).length;

  const getFilterLabel = (
    options: { label: string; value: string | number }[],
    value: string | number,
  ) => {
    return (
      options.find((opt) => opt.value === value)?.label || options[0].label
    );
  };

  const FilterBadge = ({
    label,
    onRemove,
  }: {
    label: string;
    onRemove: () => void;
  }) => (
    <Pressable
      style={({ pressed }) => [
        styles.filterBadge,
        pressed && styles.filterBadgePressed,
      ]}
      onPress={onRemove}
    >
      <Text style={styles.filterBadgeText}>{label}</Text>
      <Ionicons name="close-circle" size={16} color={COLORS.primary} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Filter Header - Always Visible */}
      <Pressable
        style={({ pressed }) => [
          styles.filterHeader,
          pressed && styles.filterHeaderPressed,
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.filterHeaderLeft}>
          <Ionicons
            name="filter"
            size={20}
            color={activeFilterCount > 0 ? COLORS.primary : COLORS.text}
          />
          <Text style={styles.filterHeaderText}>Filters</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadgeCount}>
              <Text style={styles.filterBadgeCountText}>
                {activeFilterCount}
              </Text>
            </View>
          )}
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={COLORS.text}
        />
      </Pressable>

      {/* Active Filter Badges */}
      {!isExpanded && activeFilterCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.activeBadgesContainer}
          contentContainerStyle={styles.activeBadgesContent}
        >
          {filters.category && (
            <FilterBadge
              label={getFilterLabel(CATEGORIES, filters.category)}
              onRemove={() => onFilterChange({ category: "" })}
            />
          )}
          {filters.year && (
            <FilterBadge
              label={getFilterLabel(YEARS, filters.year)}
              onRemove={() => onFilterChange({ year: "" })}
            />
          )}
          {filters.month && (
            <FilterBadge
              label={getFilterLabel(MONTHS, filters.month)}
              onRemove={() => onFilterChange({ month: "" })}
            />
          )}
        </ScrollView>
      )}

      {/* Expandable Filter Panel */}
      {isExpanded && (
        <View style={styles.filterPanel}>
          {/* Category Filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterOptionsRow}
            >
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.value}
                  style={({ pressed }) => [
                    styles.filterOption,
                    filters.category === cat.value && styles.filterOptionActive,
                    pressed && styles.filterOptionPressed,
                  ]}
                  onPress={() => onFilterChange({ category: cat.value })}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.category === cat.value &&
                      styles.filterOptionTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Year & Month Filters */}
          <View style={styles.filterRow}>
            <View style={styles.filterHalfRow}>
              <Text style={styles.filterLabel}>Year</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterOptionsRow}
              >
                {YEARS.map((yearOption) => (
                  <Pressable
                    key={String(yearOption.value)}
                    style={({ pressed }) => [
                      styles.filterOption,
                      filters.year === yearOption.value &&
                      styles.filterOptionActive,
                      pressed && styles.filterOptionPressed,
                    ]}
                    onPress={() => onFilterChange({ year: yearOption.value })}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.year === yearOption.value &&
                        styles.filterOptionTextActive,
                      ]}
                    >
                      {yearOption.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Month</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterOptionsRow}
            >
              {MONTHS.map((monthOption) => (
                <Pressable
                  key={monthOption.value}
                  style={({ pressed }) => [
                    styles.filterOption,
                    filters.month === monthOption.value &&
                    styles.filterOptionActive,
                    pressed && styles.filterOptionPressed,
                  ]}
                  onPress={() => onFilterChange({ month: monthOption.value })}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.month === monthOption.value &&
                      styles.filterOptionTextActive,
                    ]}
                  >
                    {monthOption.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Sort Order */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Sort By</Text>
            <View style={styles.filterOptionsRow}>
              {SORT_OPTIONS.map((sortOption) => (
                <Pressable
                  key={sortOption.value}
                  style={({ pressed }) => [
                    styles.filterOption,
                    filters.order === sortOption.value &&
                    styles.filterOptionActive,
                    pressed && styles.filterOptionPressed,
                  ]}
                  onPress={() =>
                    onFilterChange({
                      order: sortOption.value as "asc" | "desc",
                    })
                  }
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.order === sortOption.value &&
                      styles.filterOptionTextActive,
                    ]}
                  >
                    {sortOption.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.clearButtonPressed,
              ]}
              onPress={onClearAll}
            >
              <Ionicons name="refresh" size={18} color={COLORS.expense} />
              <Text style={styles.clearButtonText}>Clear All Filters</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterHeaderPressed: {
    backgroundColor: COLORS.background,
  },
  filterHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  filterBadgeCount: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  filterBadgeCountText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  activeBadgesContainer: {
    marginTop: 8,
  },
  activeBadgesContent: {
    gap: 8,
    paddingHorizontal: 2,
  },
  filterBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterBadgePressed: {
    opacity: 0.7,
  },
  filterBadgeText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  filterPanel: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterRow: {
    gap: 8,
  },
  filterHalfRow: {
    flex: 1,
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  filterOptionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterOptionPressed: {
    opacity: 0.7,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: COLORS.white,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#FFE5E5",
    marginTop: 8,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.expense,
  },
});
