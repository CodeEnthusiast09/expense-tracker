import { Base } from "./global";

export interface Transaction extends Base {
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
}
