import { useState } from "react";
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
} from "react-native";
import FastImage from "react-native-fast-image";

import { ImageLightbox, Skeleton } from "../atoms";
import { colors, size } from "src/data/globals";

interface ImageCarouselProps extends ViewProps {
  images: string[];
  style?: StyleProp<ViewStyle>;
}

const WINDOW_WIDTH = Dimensions.get("window").width;

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  style: AddOnStyle,
  ...props
}) => {
  //Handle carousel page
  const [currentPage, setCurrentPage] = useState(1);
  function onScrollCarousel(event: NativeSyntheticEvent<NativeScrollEvent>) {
    let currPage = Math.round(event.nativeEvent.contentOffset.x / WINDOW_WIDTH);
    setCurrentPage(currPage + 1);
  }

  return (
    <View style={AddOnStyle} {...props}>
      {images.length === 0 ? (
        <Skeleton
          style={[styles.image, { backgroundColor: colors.grey.light }]}
        />
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            decelerationRate={"fast"}
            onMomentumScrollEnd={(e) => onScrollCarousel(e)}
          >
            {images?.map((image: string) => {
              return (
                <ImageLightbox
                  key={image}
                  style={styles.image}
                  source={{ uri: image }}
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
    position: "absolute",
    right: size.l,
    bottom: size.m,
    paddingHorizontal: size.m,
    paddingVertical: size.s,
    borderRadius: size.s,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  image: {
    width: WINDOW_WIDTH,
    height: (3 / 4) * WINDOW_WIDTH,
  },
});

export default ImageCarousel;
