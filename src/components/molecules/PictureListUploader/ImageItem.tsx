import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ImageLightbox } from "src/components/atoms";
import { colors, size, typography } from "src/data/globals";

interface ImageItemProps {
  picture: string;
  index: number;
  deletePicture: (index: number) => void;
}

const ImageItem = ({ picture, index, deletePicture }: ImageItemProps) => {
  return (
    <View style={{ marginLeft: size.l }}>
      <ImageLightbox source={picture} style={styles.image} />
      <TouchableOpacity
        style={styles.imgDeleteBtn}
        activeOpacity={0.8}
        onPress={() => deletePicture(index)}
      >
        <Text
          style={{
            ...typography.paragraph3,
            color: colors.surface,
            textAlign: "center",
          }}
        >
          Hapus
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 98.2,
    width: 98.2,
    borderRadius: size.s,
  },
  imgDeleteBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderBottomLeftRadius: size.s,
    borderBottomRightRadius: size.s,
    paddingTop: 2,
    paddingBottom: size.s,
  },
});

export default ImageItem;
