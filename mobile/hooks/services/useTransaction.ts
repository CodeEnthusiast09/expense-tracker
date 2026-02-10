import { useQuery } from "@tanstack/react-query";
import { useClientRequest } from "@/services";
import { Transaction } from "@/interfaces";

export const useTransaction = (id: string) => {
  const clientRequest = useClientRequest();
  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<Transaction>({
    queryKey: ["transactions", id],
    queryFn: () => {
      return clientRequest.transaction.getOne(id);
    },
    enabled: !!id,
  });

  return {
    data: response,
    isPending,
    error,
    isError,
  };
};
