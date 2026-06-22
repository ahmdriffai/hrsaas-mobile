import { PhotoResult } from "@/components/ui/camera-capture";
import { api } from "@/lib/axios";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB

const compressToLimit = async (uri: string): Promise<string> => {
  let quality = 0.8;
  let result = await manipulateAsync(uri, [], {
    compress: quality,
    format: SaveFormat.JPEG,
  });

  while (quality > 0.1) {
    const res = await fetch(result.uri);
    const blob = await res.blob();
    if (blob.size <= MAX_BYTES) break;
    quality = parseFloat((quality - 0.1).toFixed(1));
    result = await manipulateAsync(uri, [], {
      compress: quality,
      format: SaveFormat.JPEG,
    });
  }

  return result.uri;
};

export const uploadPhoto = async (photo: PhotoResult): Promise<string> => {
  const compressedUri = await compressToLimit(photo.uri);

  const formData = new FormData();
  formData.append("file", {
    uri: compressedUri,
    name: `photo-${Date.now()}.jpg`,
    type: "image/jpeg",
  } as any);

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.status !== 200 || !response.data?.data?.url) {
    throw new Error(
      response.data?.error || response.data?.errors || "Gagal upload foto",
    );
  }

  return response.data.data.url as string;
};
