"use client";

import { DataFilter } from "@/interfaces";
import { DEFAULT_FILTERS } from "@/lib/constants";
import { useState } from "react";

export const useFilter = () => {
  const [filter, setFilter] = useState<DataFilter>(DEFAULT_FILTERS);

  const setPage = (page: number) => {
    setFilter((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSearch = (keyword: string | number) => {
    setFilter((prev) => ({
      ...prev,
      search: String(keyword).trim(),
    }));
  };

  const setOrder = (order: "desc" | "asc") => {
    setFilter((prev) => ({
      ...prev,
      order,
    }));
  };

  return { filter, setPage, setOrder, handleSearch };
};
