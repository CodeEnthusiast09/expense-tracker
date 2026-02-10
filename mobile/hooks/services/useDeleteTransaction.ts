"use client";
import { APIResponse, ApiError } from "@/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useClientRequest } from "@/services";

type MutationProp = {
  transactionId: string;
};

export const useDeleteCorrectiveActionPlan = (onSuccess?: Function) => {
  const clientRequest = useClientRequest();

  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: ({ transactionId }: MutationProp) => {
      return clientRequest.transaction.delete(transactionId);
    },
    onSuccess: (response: APIResponse) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        });

        Toast.show({
          type: "success",
          text1: response.message || "Transaction deleted successfully",
        });

        onSuccess?.();
      }
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "There was a problem deleting the transaction.",
      });
    },
  });

  return { mutate, isPending, isSuccess };
};
