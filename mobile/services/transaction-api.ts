import { transactionValidationSchema } from "@/validations";
import { InferType } from "yup";
import { useApi } from "./useApi";
import { DEFAULT_FILTERS } from "@/lib/constants";

export const useTransactionClientsRequest = () => {
  const api = useApi();

  return {
    getAll: (tableFilter = DEFAULT_FILTERS, year: number) =>
      api.get(
        `/incident-log/staff/preliminary-incident-reports?limit=${tableFilter?.limit}&page=${tableFilter?.page}&order=${tableFilter?.order}&search=${tableFilter?.search}&year=${year}`,
      ),

    getOne: (id: string) => api.get(`/habit/${id}`),

    create: (payload: InferType<typeof transactionValidationSchema>) =>
      api.post({ url: `/hse/hazard-matrices`, payload }),

    update: (payload: InferType<typeof transactionValidationSchema>) =>
      api.patch({
        url: `/hse/hazard-matrices`,
        payload,
      }),

    delete: (id: string) =>
      api.delete({
        url: `/hse/hazard-matrices/${id}`,
      }),
  };
};
