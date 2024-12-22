import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

export default async function pickImage(type: "camera" | "galery") {
  const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
  const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (mediaStatus != "granted" || cameraStatus != 'granted') {
    return Alert.alert("Error", "Please give permission to access camera and media.", [
      {
        text: "Close",
      },
      {
        text: "Open Setting",
        onPress: () => Linking.openSettings(),
      },
    ]);
  }

  let result: ImagePicker.ImagePickerResult;
  if (type == "camera") {
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
  } else {
    // No permissions request is necessary for launching the image library
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
  }

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return;
}
