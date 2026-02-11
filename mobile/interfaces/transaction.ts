import { Base } from "./global";

export interface Transaction extends Base {
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
}

export interface TransactionsSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
