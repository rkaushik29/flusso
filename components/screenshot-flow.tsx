import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Image } from "expo-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { pickImage, takePhoto, parseReceipt, type ParsedReceipt } from "@/lib/ocr";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ScreenshotFlowProps = {
  onResult: (result: ParsedReceipt) => void;
};

export function ScreenshotFlow({ onResult }: ScreenshotFlowProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (source: "library" | "camera") => {
    setError(null);
    const asset = source === "library" ? await pickImage() : await takePhoto();
    if (!asset) return;
    setImageUri(asset.uri);
    setLoading(true);
    try {
      const result = await parseReceipt(asset.uri, asset.mimeType ?? "image/jpeg");
      onResult(result);
    } catch (e: any) {
      setError(e.message || "Failed to parse");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageUri(null);
    setError(null);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="items-center gap-3 py-8">
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 120, height: 160, borderRadius: 8 }}
              contentFit="cover"
            />
          )}
          <ActivityIndicator size="large" />
          <Text className="text-muted-foreground">Analyzing receipt...</Text>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="items-center gap-3 py-6">
          <Text className="text-destructive">{error}</Text>
          <Button variant="outline" onPress={reset}>
            <Text>Try Again</Text>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex-row gap-3 py-4">
        <Button
          variant="outline"
          className="flex-1 flex-row gap-2"
          onPress={() => handlePick("library")}
        >
          <MaterialIcons name="photo" size={18} className="text-foreground" />
          <Text>Gallery</Text>
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex-row gap-2"
          onPress={() => handlePick("camera")}
        >
          <MaterialIcons name="camera-alt" size={18} className="text-foreground" />
          <Text>Camera</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
