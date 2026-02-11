import { View, Text } from "react-native";
import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { SkeletonWrapper } from "./skeleton-wrapper";
import { addCommaToNumber } from "@/lib/utils";

interface BalanceCardProps {
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
  isLoading?: boolean;
}

export const BalanceCard = ({ summary, isLoading }: BalanceCardProps) => {
  return (
    <SkeletonWrapper isLoading={isLoading} height={150} borderRadius={20}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Total Balance</Text>

        <Text style={styles.balanceAmount}>
          ₦{addCommaToNumber(summary?.balance?.toFixed(2), true) ?? "0.00"}
        </Text>
        <View style={styles.balanceStats}>
          <View style={[styles.balanceStatItem, { alignItems: "flex-start" }]}>
            <Text style={styles.balanceStatLabel}>Income</Text>

            <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
              +₦
              {addCommaToNumber(summary?.totalIncome?.toFixed(2), true) ??
                "0.00"}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={[styles.balanceStatItem, { alignItems: "flex-end" }]}>
            <Text style={styles.balanceStatLabel}>Expenses</Text>

            <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
              -₦
              {addCommaToNumber(summary?.totalExpense?.toFixed(2), true) ??
                "0.00"}
            </Text>
          </View>
        </View>
      </View>
    </SkeletonWrapper>
  );
};
