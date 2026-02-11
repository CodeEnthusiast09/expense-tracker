import { transactionValidationSchema } from "@/validations";
import { InferType } from "yup";
import { useApi } from "./useApi";
import { DEFAULT_FILTERS } from "@/lib/constants";

export const useTransactionClientsRequest = () => {
  const api = useApi();

  return {
    getAll: (
      tableFilter = DEFAULT_FILTERS,
      {
        year,
        month,
        category,
      }: { year?: number; month?: string; category?: string },
    ) => {
      let query = `limit=${tableFilter?.limit}&page=${tableFilter?.page}&order=${tableFilter?.order}&search=${tableFilter?.search}`;

      if (year) {
        query += `&year=${year}`;
      }

      if (month) {
        query += `&month=${month}`;
      }

      if (category) {
        query += `&category=${category}`;
      }

      return api.get(`/transactions?${query}`);
    },

    getOne: (id: string) => api.get(`/transactions/${id}`),

    create: (payload: InferType<typeof transactionValidationSchema>) =>
      api.post({ url: `/transactions`, payload }),

    update: (
      id: string,
      payload: InferType<typeof transactionValidationSchema>,
    ) =>
      api.patch({
        url: `/transactions/${id}`,
        payload,
      }),

    delete: (id: string) =>
      api.delete({
        url: `/transactions/${id}`,
      }),

    getSummary: () => api.get(`/transactions/summary`),
  };
};
