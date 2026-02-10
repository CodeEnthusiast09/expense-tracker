import { useTransactionClientsRequest } from "./transaction-api";

// Export a hook that returns all API clients
export const useClientRequest = () => {
  return {
    transaction: useTransactionClientsRequest(),
  };
};
