export type SearchEmployeeRequest = {
  key?: string;
  page?: number;
  size?: number;
};

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
