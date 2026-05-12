import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";

import { SearchVisit, Visit } from "../schemas/visit-schema";

export const currentVisitsService = async (
  search: SearchVisit,
): Promise<ResponseData<Visit[]>> => {
  const response = await api.get("/visits/_current", {
    params: {
      visit_type: search.visit_type,
      start_date: search.start_date,
      end_date: search.end_date,
      sort_by: search.sort_by,
      page: search.page,
      size: search.size,
    },
  });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Failed to fetch visits");
  }

  const data = response.data.data;

  return { ...response.data, data };
};
