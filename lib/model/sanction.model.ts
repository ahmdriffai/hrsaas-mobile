import { Employee } from "./employee.model";

export type Sanction = {
  id: string;
  employee: Employee;
  sanction: SanctionType;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
};

export type SanctionType = {
  id: string;
  name: string;
  description: string;
};

export type SearchSanctionRequest = {
  sanction_id?: string;
  reason?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  status?: string; // active, lifted, expired
  page?: number;
  size?: number;
};

export type SearchSanctionTypeReq = {
  key?: string;
  page?: number;
  size?: number;
};
