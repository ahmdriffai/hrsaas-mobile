import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";
import {
  TimeOffBalance,
  TimeOffBalanceListSchema,
} from "../schemas/time-off-balance-schema";

export const getTimeOffBalanceService = async (
  period_year: number
): Promise<ResponseData<TimeOffBalance[]>> => {
  const response = await api.get("/time-off-balances/_current", {
    params: { period_year },
  });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memuat saldo cuti");
  }

  const data = TimeOffBalanceListSchema.parse(response.data.data);

  return { ...response.data, data };
};
