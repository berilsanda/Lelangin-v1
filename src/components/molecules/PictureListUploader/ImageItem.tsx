import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Source } from 'react-native-fast-image';
import { ImageLightbox } from 'src/components/atoms';

import { Colors, Spacing, Typography } from '@/config/constant';

interface ImageItemProps {
  picture: Source;
  index: number;
  deletePicture: (index: number) => void;
}

const ImageItem = ({ picture, index, deletePicture }: ImageItemProps) => {
  return (
    <View style={{ marginLeft: Spacing.l }}>
      <ImageLightbox source={picture} style={styles.image} />
      <TouchableOpacity
        style={styles.imgDeleteBtn}
        activeOpacity={0.8}
        onPress={() => deletePicture(index)}
      >
        <Text
          style={{
            ...Typography.paragraph3,
            color: Colors.surface,
            textAlign: 'center',
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
    borderRadius: Spacing.s,
  },
  imgDeleteBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderBottomLeftRadius: Spacing.s,
    borderBottomRightRadius: Spacing.s,
    paddingTop: 2,
    paddingBottom: Spacing.s,
  },
});

export default ImageItem;
