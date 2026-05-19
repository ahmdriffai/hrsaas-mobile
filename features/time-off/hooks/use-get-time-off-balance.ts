import { useQuery } from "@tanstack/react-query";
import { getTimeOffBalanceService } from "../services/get-time-off-balance-service";

export const useGetTimeOffBalance = (period_year: number) =>
  useQuery({
    queryKey: ["time-off-balances", "current", period_year],
    queryFn: () => getTimeOffBalanceService(period_year),
  });
