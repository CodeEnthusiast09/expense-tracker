import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { Transaction } from "@/interfaces";
import { addCommaToNumber, formatDate } from "@/lib/utils";

// Map categories to their respective icons
const CATEGORY_ICONS: Record<string, any> = {
  income: "cash",
  expense: "card",
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Other: "ellipsis-horizontal",
};

interface TransactionItemProps {
  item: Transaction;
  onDelete: (id: string) => void;
}

export const TransactionItem = ({ item, onDelete }: TransactionItemProps) => {
  const isIncome = item.category === "income";
  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

  return (
    <View style={styles.transactionCard}>
      <TouchableOpacity style={styles.transactionContent}>
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
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};
