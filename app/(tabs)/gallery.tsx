import { View, Button, Image, Text } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function GalleryScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setResult("Processing image... (placeholder)");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <Button title="Pick from Gallery 🖼️" onPress={pickImage} />

      {image && (
        <>
          <Image
            source={{ uri: image }}
            style={{ width: 250, height: 250, marginTop: 20 }}
          />

          <Text style={{ marginTop: 10 }}>{result}</Text>
        </>
      )}

    </View>
  );
}