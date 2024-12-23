import { useState } from "react";
import {
  TouchableWithoutFeedback,
  Modal,
  View,
  StyleSheet,
  StyleProp,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FastImage, { FastImageProps, ImageStyle } from "react-native-fast-image";

import { colors, size } from "src/data/globals";
import ImageZooms from "./ImageZooms";

interface ImageLightboxProps extends FastImageProps {
  style?: StyleProp<ImageStyle>;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  source,
  style,
  ...imageProps
}) => {
  const [showModal, setShowModal] = useState(false);

  function getUri() {
    if (typeof source === "object" && source !== null && "uri" in source) {
      return source.uri;
    }

    return undefined;
  }

  const uri = getUri();

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setShowModal(true)}>
        <FastImage style={style} source={source} {...imageProps} />
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
        <ImageZooms uri={uri} />
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
