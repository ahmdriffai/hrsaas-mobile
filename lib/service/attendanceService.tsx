const API_URL = "https://devsaas.bankwonosobo.co.id/api";

export type CheckInRequest = {
  lat: number;
  lng: number;
  face_image_url: string;
  device_info: string;
};

export async function checkin(token: string, data: CheckInRequest) {
  return await fetch(`${API_URL}/attendances/check-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}
