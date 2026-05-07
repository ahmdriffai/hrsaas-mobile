import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";
import { User, UserSchema } from "../schemas/auth-schema";

export const getCurrentUserService = async (): Promise<ResponseData<User>> => {
  const response = await api.get("/users/_current");

  if (response.status !== 200) {
    throw new Error(response.data.error || "Failed to fetch current user");
  }

  const userData = UserSchema.parse(response.data.data);

  return { ...response.data, data: userData };
};
