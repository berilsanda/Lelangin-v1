import { useState } from "react";
import {
  Image,
  TouchableWithoutFeedback,
  ImageStyle,
  Modal,
  View,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { colors, size } from "src/data/globals";
import ImageZooms from "./ImageZooms";

interface ImageLightboxProps {
  source: string;
  style?: ImageStyle;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  source,
  style,
  ...imageProps
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setShowModal(true)}>
        <Image style={style} source={{ uri: source }} {...imageProps} />
      </TouchableWithoutFeedback>

      <Modal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        animationType="fade"
        transparent
      >
        <MaterialCommunityIcons
          name={"close"}
          size={24}
          color={colors.surface}
          onPress={() => setShowModal(false)}
          style={styles.iconStyles}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "rgba(0,0,0,0.5)" },
          ]}
        />
        <ImageZooms source={source} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconStyles: {
    position: "absolute",
    right: size.xl,
    top: size.l,
    zIndex: 99,
  },
});

export default ImageLightbox;
