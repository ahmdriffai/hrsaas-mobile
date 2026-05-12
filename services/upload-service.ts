import { PhotoResult } from "@/components/ui/camera-capture";
import { api } from "@/lib/axios";

export const uploadPhoto = async (photo: PhotoResult): Promise<string> => {
  const formData = new FormData();
  formData.append("file", {
    uri: photo.uri,
    name: `photo-${Date.now()}.jpg`,
    type: photo.mimeType,
  } as any);

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status !== 200 || !response.data?.data?.url) {
    throw new Error(
      response.data?.error || response.data?.errors || "Gagal upload foto"
    );
  }

  return response.data.data.url as string;
};
