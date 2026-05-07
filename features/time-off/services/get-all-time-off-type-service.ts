import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";
import {
  TimeOffType,
  TimeOffTypeListSchema,
} from "../schemas/type-off-type-schema";

export const getAllTimeOffTypeService = async (): Promise<
  ResponseData<TimeOffType[]>
> => {
  const response = await api.get("/time-off-types");

  if (response.status !== 200) {
    throw new Error(response.data.error || "Failed to fetch time off types");
  }

  const data = TimeOffTypeListSchema.parse(response.data.data);

  return { ...response.data, data };
};
