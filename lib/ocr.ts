import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system/next";

// Update this after deploying your worker
const WORKER_URL = "https://flusso-worker.YOUR_SUBDOMAIN.workers.dev";

export type ParsedReceipt = {
  amount: number;
  currency: "EUR" | "CAD";
  description: string;
  category: string;
  date: string | null;
};

export async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
    base64: false,
  });
  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0];
}

export async function takePhoto() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") return null;

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    base64: false,
  });
  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0];
}

export async function parseReceipt(
  uri: string,
  mimeType = "image/jpeg"
): Promise<ParsedReceipt> {
  const file = new File(uri);
  const base64 = await file.base64();

  const res = await fetch(`${WORKER_URL}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64, mimeType }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to parse receipt");
  }

  return res.json();
}
