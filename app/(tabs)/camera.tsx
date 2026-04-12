import { View, Button, Image, Text } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function CameraScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const takePhoto = async () => {
    let res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setImage(uri);

      // send to YOLO backend
      sendToYOLO(uri);
    }
  };

  const sendToYOLO = async (uri) => {
    setResult("Running YOLO detection... 🤖");

    const formData = new FormData();
    formData.append("image", {
      uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("model", "yolov8");

    try {
      const response = await axios.post(
        "http://192.168.200.104:5000/detect",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult("❌ Error: Backend not reachable");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <Button title="Open Camera 📸" onPress={takePhoto} />

      {image && (
        <>
          <Image
            source={{ uri: image }}
            style={{ width: 250, height: 250, marginTop: 20 }}
          />

          <Text style={{ marginTop: 10 }}>
            {result}
          </Text>
        </>
      )}

    </View>
  );
}