export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }
}
