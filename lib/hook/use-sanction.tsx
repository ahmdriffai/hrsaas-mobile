import { sanctionTypeList } from "@/lib/api/sanction.api";
import type {
  SanctionType,
  SearchSanctionTypeReq,
} from "@/lib/model/sanction.model";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Paging } from "../model/paging-model";

export function useGetSanctionType(
  token: string | undefined,
  search: SearchSanctionTypeReq
) {
  return useQuery<{
    paging: Paging;
    data: SanctionType[];
  }>({
    queryKey: ["sanction-types", search],
    queryFn: async () => sanctionTypeList(token, search),
    enabled: !!token,
    placeholderData: keepPreviousData,
    retry: 2,
  });
}
