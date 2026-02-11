import { useQuery } from "@tanstack/react-query";
import { useClientRequest } from "@/services";
import { TransactionsSummary } from "@/interfaces";

export const useTransactionsSummary = () => {
  const clientRequest = useClientRequest();

  const {
    data: response,
    isPending,
    error,
    isError,
    refetch,
  } = useQuery<TransactionsSummary>({
    queryKey: ["transactions-summary"],
    queryFn: () => {
      return clientRequest?.transaction?.getSummary();
    },
  });

  return {
    data: response,
    isPending,
    error,
    isError,
    refetch,
  };
};
