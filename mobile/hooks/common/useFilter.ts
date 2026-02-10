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

  const handleSearch = (keyword: string) => {
    setFilter((prev) => ({
      ...prev,
      search: keyword.trim(),
    }));
  };

  return { filter, setPage, handleSearch };
};
