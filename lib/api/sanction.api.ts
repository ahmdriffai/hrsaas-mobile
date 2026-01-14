import { Paging } from "../model/paging-model";
import { Sanction, SanctionType, SearchSanctionRequest, SearchSanctionTypeReq } from "../model/sanction.model";

const BASE_URL = import.meta.env.VITE_API_PATH;

export const sanctionTypeList = async (
  token: string | undefined,
  request: SearchSanctionTypeReq
): Promise<{ paging: Paging; data: SanctionType[] }> => {
  const url = new URL(`${BASE_URL}/sanctions`);

  if (request.key) url.searchParams.append("key", request.key);
  if (request.page) url.searchParams.append("page", request.page.toString());
  if (request.size) url.searchParams.append("size", request.size.toString());

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch employees");
  }

  return response.json();
};



export const sanctionList = async (
  token: string,
  request: SearchSanctionRequest
): Promise<{ paging: Paging; data: Sanction[] }> => {
  const url = new URL(`${BASE_URL}/employee-sanctions`);

  if (request.reason) url.searchParams.append("reason", request.reason);
  if (request.sanction_id)
    url.searchParams.append("sanction_id", request.sanction_id);
  if (request.start_date)
    url.searchParams.append("start_date", request.start_date);
  if (request.end_date) url.searchParams.append("end_date", request.end_date);
  if (request.status) url.searchParams.append("status", request.status);
  if (request.page) url.searchParams.append("page", request.page.toString());
  if (request.size) url.searchParams.append("size", request.size.toString());

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Failed to fetch employees");
  }

  return response.json();
};
