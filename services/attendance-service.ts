import { api } from "@/lib/axios";

export type CheckInRequest = {
  lat: number;
  lng: number;
  face_image_url: string;
  device_info: string;
};

export const checkin = (data: CheckInRequest) =>
  api.post("/attendances/check-in", data);
