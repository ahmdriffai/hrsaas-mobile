import { useQuery } from "@tanstack/react-query";
import { SearchEmployeeSanction } from "../schemas/sanction-schema";
import { searchSanctionService } from "../services/search-sanction-service";

export const useSearchSanction = (params?: SearchEmployeeSanction) =>
  useQuery({
    queryKey: ["employee-sanctions", "current", params],
    queryFn: () => searchSanctionService(params),
    placeholderData: (prev) => prev,
  });
