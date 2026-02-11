import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { Transaction } from "@/interfaces";
import { addCommaToNumber, formatDate } from "@/lib/utils";
import { useRouter } from "expo-router";

// Map categories to their respective icons
const CATEGORY_ICONS: Record<string, any> = {
  income: "cash",
  expense: "card",
};

interface TransactionItemProps {
  item: Transaction;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const TransactionItem = ({
  item,
  onDelete,
  isDeleting = false,
}: TransactionItemProps) => {
  const router = useRouter();

  const isIncome = item.category === "income";

  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

  const handlePress = () => {
    // Navigate to edit/view transaction details
    // You can create this screen later
    router.push(`/${item.id}`);
    // OR if you don't have a details screen yet, just comment it out:
    // console.log("View transaction:", item.id);
  };

  return (
    <View style={styles.transactionCard}>
      <Pressable
        style={({ pressed }) => [
          styles.transactionContent,
          pressed &&
          {
            // backgroundColor: COLORS.background,
            // opacity: 0.7,
          },
        ]}
        onPress={handlePress}
        android_ripple={{ color: COLORS.primary + "20" }}
        disabled={isDeleting}
      >
        <View style={styles.categoryIconContainer}>
          <Ionicons
            name={iconName}
            size={22}
            color={isIncome ? COLORS.income : COLORS.expense}
          />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.description}</Text>

          <Text style={styles.transactionCategory}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIncome ? COLORS.income : COLORS.expense },
            ]}
          >
            {isIncome ? "+" : "-"}₦
            {addCommaToNumber(item.amount.toFixed(2), true)}
          </Text>

          <Text style={styles.transactionDate}>
            {formatDate(item.transactionDate)}
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && { backgroundColor: "#FFE5E5" },
          isDeleting && { opacity: 0.6 },
        ]}
        onPress={() => onDelete(item.id)}
        android_ripple={{ color: COLORS.expense + "30" }}
        disabled={isDeleting}
      >
        {isDeleting ? (
          // ⏳ Show loading spinner while deleting
          <ActivityIndicator size="small" color={COLORS.expense} />
        ) : (
          // 🗑️ Show trash icon normally
          <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
        )}
      </Pressable>
    </View>
  );
};
