import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import {
  TouchableWithoutFeedback,
  Modal,
  View,
  StyleSheet,
  StyleProp,
} from 'react-native';
import FastImage, { FastImageProps, ImageStyle } from 'react-native-fast-image';

import ImageZooms from './ImageZooms';

import { Colors, Spacing } from '@/config/constant';

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
    if (typeof source === 'object' && source !== null && 'uri' in source) {
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
          name={'close'}
          size={24}
          color={Colors.surface}
          onPress={() => setShowModal(false)}
          style={styles.iconStyles}
        />
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(0,0,0,0.5)' },
          ]}
        />
        <ImageZooms uri={uri} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconStyles: {
    position: 'absolute',
    right: Spacing.xl,
    top: Spacing.l,
    zIndex: 99,
  },
});

export default ImageLightbox;
