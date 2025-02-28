import React, { useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import FastImage, { Source } from 'react-native-fast-image';

import { ImageLightbox, Skeleton } from '../atoms';

import { Colors, Spacing } from '@/config/constant';

interface ImageCarouselProps extends ViewProps {
  images: Source[];
  style?: StyleProp<ViewStyle>;
}

const WINDOW_WIDTH = Dimensions.get('window').width;

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  style: AddOnStyle,
  ...props
}) => {
  //Handle carousel page
  const [currentPage, setCurrentPage] = useState(1);
  function onScrollCarousel(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const currPage = Math.round(
      event.nativeEvent.contentOffset.x / WINDOW_WIDTH,
    );
    setCurrentPage(currPage + 1);
  }

  return (
    <View style={AddOnStyle} {...props}>
      {images.length === 0 ? (
        <Skeleton
          style={[styles.image, { backgroundColor: Colors.grey.light }]}
        />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            decelerationRate={'fast'}
            onMomentumScrollEnd={(e) => onScrollCarousel(e)}
          >
            {images?.map((image: Source, i) => {
              return (
                <ImageLightbox
                  key={i}
                  style={styles.image}
                  source={image}
                  resizeMode={FastImage.resizeMode.cover}
                />
              );
            })}
          </ScrollView>

          <View style={styles.carouselIndicator}>
            <Text>{`${currentPage} / ${images?.length || 0}`}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselIndicator: {
    position: 'absolute',
    right: Spacing.l,
    bottom: Spacing.m,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Spacing.s,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  image: {
    width: WINDOW_WIDTH,
    height: (3 / 4) * WINDOW_WIDTH,
  },
});

export default ImageCarousel;
