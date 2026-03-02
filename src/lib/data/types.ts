/**
 * أنواع مركزية لطبقة البيانات — CIAR
 * DTOs وواجهات مشتركة لجميع وحدات البيانات
 */

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListFilters {
  search?: string;
  status?: string;
  isActive?: boolean;
  from?: Date;
  to?: Date;
}
