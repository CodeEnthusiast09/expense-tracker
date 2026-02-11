import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SignOutButton } from "@/components/signout-button";
import {
  useDeleteTransaction,
  useTransactions,
  useTransactionsSummary,
} from "@/hooks/services";
import { useEffect, useRef, useState } from "react";
import { styles } from "@/assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "@/components/balance-card";
import { TransactionItem } from "@/components/transaction-item";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import NoTransactionsFound from "@/components/empty-state";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import { SearchBox } from "@/components/search-box";
import { TransactionFilters } from "@/components/transaction-filters";
import { LoadMoreButton } from "@/components/load-more-button";

export default function Page() {
  const { user } = useUser();

  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State to accumulate transactions across pages
  const [accumulatedTransactions, setAccumulatedTransactions] = useState<any[]>(
    [],
  );

  // Track if we're loading more (different from initial load)
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Track previous filter state to detect changes
  const prevFiltersRef = useRef<string>("");

  // Fetch transactions and summary
  const {
    data: transactions,
    pagination,
    isPending: isLoadingTransactions,
    isError: isTransactionsError,
    // error: transactionsError,
    refetch: refetchTransactions,
    options,
    setPage,
    setOrder,
    filter,
    handleSearch,
  } = useTransactions();

  const {
    data: summary,
    isPending: isLoadingSummary,
    isError: isSummaryError,
    // error: summaryError,
    refetch: refetchSummary,
  } = useTransactionsSummary();

  const { mutate: deleteTransaction } = useDeleteTransaction(() => {
    setDeletingId(null);
  });

  useEffect(() => {
    const currentFilters = JSON.stringify({
      search: filter.search,
      category: options.category,
      year: options.year,
      month: options.month,
      order: filter.order,
    });

    // If filters changed, reset to page 1 and clear accumulated data
    if (prevFiltersRef.current && prevFiltersRef.current !== currentFilters) {
      setPage(1);
      setAccumulatedTransactions([]);
    }

    prevFiltersRef.current = currentFilters;
  }, [
    filter.search,
    options.category,
    options.year,
    options.month,
    filter.order,
    setPage,
  ]);

  // Accumulate transactions when new data arrives
  useEffect(() => {
    if (transactions && !isLoadingTransactions) {
      setAccumulatedTransactions((prev) => {
        // If on page 1, replace all data
        if (pagination?.currentPage === 1) {
          return transactions;
        }

        // Otherwise, append new transactions (avoid duplicates)
        const existingIds = new Set(prev.map((t) => t.id));
        const newTransactions = transactions.filter(
          (t) => !existingIds.has(t.id),
        );
        return [...prev, ...newTransactions];
      });

      setIsLoadingMore(false);
    }
  }, [transactions, isLoadingTransactions, pagination?.currentPage]);

  useEffect(() => {
    if (isTransactionsError) {
      Toast.show({
        type: "error",
        text1: "Failed to load transactions",
        text2: "Please pull to refresh",
      });
    }
  }, [isTransactionsError]);

  useEffect(() => {
    if (isSummaryError) {
      Toast.show({
        type: "error",
        text1: "Failed to load summary",
        text2: "Please pull to refresh",
      });
    }
  }, [isSummaryError]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchTransactions(), refetchSummary()]);
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // 📳 Haptic feedback for delete confirmation
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            // 🎯 Set the transaction as being deleted
            setDeletingId(id);

            // 🗑️ Perform the deletion
            deleteTransaction(
              { transactionId: id },
              {
                onSettled: () => {
                  setDeletingId(null);
                },
              },
            );
          },
        },
      ],
    );
  };

  const handleFilterChange = (newFilters: {
    category?: string;
    year?: number | "";
    month?: string;
    order?: "asc" | "desc";
  }) => {
    if (newFilters.category !== undefined)
      options.setCategory(newFilters.category);
    if (newFilters.year !== undefined) options.setYear(newFilters.year);
    if (newFilters.month !== undefined) options.setMonth(newFilters.month);
    if (newFilters.order !== undefined) setOrder(newFilters.order); // ← Use setOrder from filter
  };

  const handleClearFilters = () => {
    options.setCategory("");
    options.setYear("");
    options.setMonth("");
  };

  // Handle load more button click
  const handleLoadMore = () => {
    if (!pagination) return;

    const { currentPage, hasMorePages } = pagination;

    if (!hasMorePages || isLoadingMore || isLoadingTransactions) return;

    if (typeof currentPage !== "number") return;

    setIsLoadingMore(true);

    setPage(currentPage + 1);
  };

  const renderHeader = () => (
    <View>
      {/* HEADER */}
      <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.usernameText}>
              {user?.emailAddresses[0]?.emailAddress.split("@")[0] || "User"}
            </Text>
          </View>
        </View>
        {/* RIGHT */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/create")}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <SignOutButton />
        </View>
      </View>

      {/* Balance Card with Skeleton */}
      <BalanceCard
        summary={summary ?? { totalIncome: 0, totalExpense: 0, balance: 0 }}
        isLoading={isLoadingSummary}
      />

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <SearchBox
          value={filter.search ?? ""}
          placeholder="Search by category..."
          onChange={handleSearch}
          debounce={500}
        />
      </View>

      {/* Filters */}
      <TransactionFilters
        filters={{
          category: options.category,
          year: options.year,
          month: options.month,
          order: filter.order as "asc" | "desc",
        }}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearFilters}
      />

      <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
    </View>
  );

  const displayData =
    isLoadingTransactions && !refreshing && accumulatedTransactions.length === 0
      ? Array(5).fill({}) // Show skeletons on initial load only
      : accumulatedTransactions;

  return (
    <View style={styles.container}>
      {/* Always show FlatList, but change what's IN the list */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        // Header is ALWAYS shown (with BalanceCard skeleton)
        ListHeaderComponent={renderHeader}
        // Show different data based on loading state
        data={displayData}
        // Render skeleton OR real transaction
        renderItem={({ item, index }) => {
          // If loading, show skeleton
          if (isLoadingTransactions && !refreshing) {
            return (
              <SkeletonWrapper
                key={`skeleton-${index}`}
                isLoading
                height={80}
                borderRadius={12}
              />
            );
          }

          // Otherwise show real transaction
          return (
            <TransactionItem
              item={item}
              onDelete={handleDelete}
              isDeleting={deletingId === item.id}
            />
          );
        }}
        ListEmptyComponent={
          // Only show empty state if NOT loading
          !isLoadingTransactions ? <NoTransactionsFound /> : null
        }
        ListFooterComponent={
          pagination && typeof pagination.total === "number" ? (
            <LoadMoreButton
              totalItems={pagination.total}
              loadedItems={accumulatedTransactions.length}
              isLoading={isLoadingMore}
              onLoadMore={handleLoadMore}
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
