import { APIResponse, ApiError } from "@/interfaces";
import { useClientRequest } from "@/services";
import { transactionValidationSchema } from "@/validations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { InferType } from "yup";

type MutationProp = {
  data: InferType<typeof transactionValidationSchema>;
};

export const useCreateTransactions = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const clientRequest = useClientRequest();

  const { mutate, isPending, isSuccess } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: async ({ data }: MutationProp) => {
      return clientRequest.transaction.create(data);
    },
    onSuccess: (response: APIResponse) => {
      if (response?.success) {
        Toast.show({
          type: "success",
          text1: response.message || "Transaction created successfully",
        });
        queryClient.invalidateQueries({
          queryKey: ["transactions"],
        });

        router.replace("/(root)");
      }
    },
    onError: (error: ApiError) => {
      Toast.show({
        type: "error",
        text1: error?.message || "Opps! Something went wrong.",
      });
    },
  });
  return { mutate, isPending, isSuccess };
};
