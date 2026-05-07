import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";
import { Auth, AuthSchema } from "../schemas/auth-schema";
import { getCurrentUserService } from "./current-user-service";

export const signInService = async (
  email: string,
  password: string,
): Promise<ResponseData<Auth>> => {
  const response = await api.post("/_login", { email, password });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Login failed");
  }

  const authData = AuthSchema.parse(response.data.data);

  const userResponse = await getCurrentUserService();

  authData.user = userResponse.data;

  return { ...response.data, data: authData };
};
