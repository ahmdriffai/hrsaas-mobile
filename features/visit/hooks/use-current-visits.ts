import { useQuery } from "@tanstack/react-query";
import { SearchVisit } from "../schemas/visit-schema";
import { currentVisitsService } from "../services/current-visits-service";

export const useCurrentVisits = (search: SearchVisit) =>
  useQuery({
    queryKey: ["visits", search],
    queryFn: () => currentVisitsService(search),
  });
