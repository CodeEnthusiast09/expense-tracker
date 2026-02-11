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
import { useState } from "react";
import { styles } from "@/assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "@/components/balance-card";
import { TransactionItem } from "@/components/transaction-item";
import { SkeletonWrapper } from "@/components/skeleton-wrapper";
import NoTransactionsFound from "@/components/empty-state";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch transactions and summary
  const {
    data: transactions,
    isPending: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useTransactions();

  const {
    data: summary,
    isPending: isLoadingSummary,
    refetch: refetchSummary,
  } = useTransactionsSummary();

  const { mutate: deleteTransaction } = useDeleteTransaction();

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
          onPress: () => deleteTransaction({ transactionId: id }), // ✅ Call with object
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      {/* Transactions List with Skeleton */}
      {isLoadingTransactions && !refreshing ? (
        <View style={styles.transactionsListContent}>
          <SkeletonWrapper isLoading count={5} height={80} />
        </View>
      ) : (
        <FlatList
          style={styles.transactionsList}
          contentContainerStyle={styles.transactionsListContent}
          data={transactions || []}
          renderItem={({ item }) => (
            <TransactionItem item={item} onDelete={handleDelete} />
          )}
          ListEmptyComponent={<NoTransactionsFound />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
