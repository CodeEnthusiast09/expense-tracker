export interface DataFilter {
  limit?: number;
  page?: number;
  order?: "desc" | "asc";
  search?: string;
}
