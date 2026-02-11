import { useQuery } from "@tanstack/react-query";
import { useClientRequest } from "@/services";
import { Pagination, Transaction } from "@/interfaces";
import { useFilter } from "../common";
import { useState } from "react";

export const useTransactions = () => {
  const clientRequest = useClientRequest();

  const { setPage, filter, handleSearch, setOrder } = useFilter();

  const [year, setYear] = useState<number | "">("");

  const [month, setMonth] = useState<string>("");

  const [category, setCategory] = useState<string>("");

  const options = {
    month,
    setMonth,
    year,
    setYear,
    category,
    setCategory,
  };

  const {
    data: response,
    isPending,
    error,
    isError,
    refetch,
  } = useQuery<{
    data: Transaction[];
    pagination: Pagination;
  }>({
    queryKey: ["transactions", options, filter],
    queryFn: () => {
      return clientRequest.transaction.getAll(filter, {
        year: year || undefined,
        month,
        category,
      });
    },
  });

  return {
    data: response?.data,
    pagination: response?.pagination,
    isPending,
    error,
    isError,
    refetch,
    options,
    setPage,
    setOrder,
    filter,
    handleSearch,
  };
};
