// "use client";
// import { APIResponse, ApiError } from "@/interfaces";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import Toast from "react-native-toast-message";
// import { useClientRequest } from "@/services";
//
// type MutationProp = {
//   transactionId: string;
// };
//
// export const useDeleteTransaction = (onSuccess?: Function) => {
//   const clientRequest = useClientRequest();
//
//   const queryClient = useQueryClient();
//
//   const { mutate, isPending, isSuccess } = useMutation<
//     APIResponse,
//     ApiError,
//     MutationProp
//   >({
//     // @ts-ignore
//     mutationFn: ({ transactionId }: MutationProp) => {
//       return clientRequest.transaction.delete(transactionId);
//     },
//     onSuccess: (response: APIResponse) => {
//       if (response?.success) {
//         queryClient.invalidateQueries({
//           queryKey: ["transactions"],
//         });
//
//         queryClient.invalidateQueries({
//           queryKey: ["transactions-summary"],
//         });
//
//         Toast.show({
//           type: "success",
//           text1: response.message || "Transaction deleted successfully",
//         });
//
//         onSuccess?.();
//       }
//     },
//     onError: () => {
//       Toast.show({
//         type: "error",
//         text1: "There was a problem deleting the transaction.",
//       });
//     },
//   });
//
//   return { mutate, isPending, isSuccess };
// };

import {
  APIResponse,
  ApiError,
  Transaction,
  Pagination,
  TransactionsSummary,
} from "@/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useClientRequest } from "@/services";

type MutationProp = {
  transactionId: string;
};

export const useDeleteTransaction = (onSuccess?: Function) => {
  const clientRequest = useClientRequest();
  const queryClient = useQueryClient();

  type DeleteTransactionContext = {
    previousTransactions?: {
      data: Transaction[];
      pagination: Pagination;
    };
    previousSummary?: TransactionsSummary;
  };

  const { mutate, isPending, isSuccess } = useMutation<
    APIResponse,
    ApiError,
    MutationProp,
    DeleteTransactionContext
  >({
    // @ts-ignore
    mutationFn: ({ transactionId }: MutationProp) => {
      return clientRequest.transaction.delete(transactionId);
    },

    // 🎯 OPTIMISTIC UPDATE: Remove from UI immediately for instant feedback
    onMutate: async ({ transactionId }): Promise<DeleteTransactionContext> => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      await queryClient.cancelQueries({ queryKey: ["transactions-summary"] });

      const previousTransactions = queryClient.getQueryData<{
        data: Transaction[];
        pagination: Pagination;
      }>(["transactions"]);

      const previousSummary = queryClient.getQueryData<TransactionsSummary>([
        "transactions-summary",
      ]);

      let deletedTransaction: Transaction | undefined;

      if (previousTransactions) {
        queryClient.setQueryData<{
          data: Transaction[];
          pagination: Pagination;
        }>(["transactions"], (old) => {
          if (!old) return old;

          deletedTransaction = old.data.find((t) => t.id === transactionId);

          return {
            ...old,
            data: old.data.filter((t) => t.id !== transactionId),
          };
        });
      }

      if (previousSummary && deletedTransaction) {
        queryClient.setQueryData<TransactionsSummary>(
          ["transactions-summary"],
          (old) => {
            if (!old) return old;

            if (deletedTransaction!.category === "income") {
              return {
                ...old,
                totalIncome: old.totalIncome - deletedTransaction!.amount,
                balance: old.balance - deletedTransaction!.amount,
              };
            }

            if (deletedTransaction!.category === "expense") {
              return {
                ...old,
                totalExpense: old.totalExpense - deletedTransaction!.amount,
                balance: old.balance + deletedTransaction!.amount,
              };
            }

            return old;
          },
        );
      }

      return { previousTransactions, previousSummary };
    },

    onSuccess: (response: APIResponse) => {
      // ✅ Refetch to get accurate data from server
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions-summary"],
      });

      Toast.show({
        type: "success",
        text1: response.message || "Transaction deleted successfully",
      });

      onSuccess?.();
    },

    // 🔄 ROLLBACK: If mutation fails, restore previous state
    onError: (_error, _variables, context) => {
      // Restore the previous state
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          ["transactions"],
          context.previousTransactions,
        );
      }
      if (context?.previousSummary) {
        queryClient.setQueryData(
          ["transactions-summary"],
          context.previousSummary,
        );
      }

      Toast.show({
        type: "error",
        text1: "Failed to delete transaction",
        text2: "Please try again",
      });

      onSuccess?.();
    },
  });

  return { mutate, isPending, isSuccess };
};
