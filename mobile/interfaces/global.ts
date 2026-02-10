export interface Pagination {
  currentPage?: number;
  hasMorePages?: boolean;
  lastPage?: number;
  perPage?: number;
  total?: number;
}

export interface Base {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}
