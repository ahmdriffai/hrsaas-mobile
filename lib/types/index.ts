// Response
export type ResponseData<T> = {
  message: string;
  success: boolean;
  data: T;
};

export type ResponseDataArr<T> = {
  message: string;
  success: boolean;
  data: T[];
};

// Paging
export type Paging = {
  page: number;
  size: number;
  total_item: number;
  total_page: number;
};

export type PaginatedData<T> = {
  paging: Paging;
  data: T[];
};

// Employee
export type Employee = {
  id: string;
  fullname: string;
  employee_number: string;
  birth_place: string;
  birth_date: string;
  blood_type: string;
  marital_status: string;
  religion: string;
  phone: string;
  timezone: string;
};

export type SearchEmployeeRequest = {
  key?: string;
  page?: number;
  size?: number;
};

// Sanction
export type SanctionType = {
  id: string;
  name: string;
  description: string;
};

export type Sanction = {
  id: string;
  employee: Employee;
  sanction: SanctionType;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
};

export type SearchSanctionRequest = {
  sanction_id?: string;
  reason?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  page?: number;
  size?: number;
};

export type SearchSanctionTypeReq = {
  key?: string;
  page?: number;
  size?: number;
};
