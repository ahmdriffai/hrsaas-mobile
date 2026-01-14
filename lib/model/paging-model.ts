export type Paging = {
  page: number;
  size: number;
  total_item: number;
  total_page: number;
};

export interface ListResponse<T> {
  data: T[];
  paging: Paging;
}
