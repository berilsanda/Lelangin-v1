import {
  ImageZoom,
  ImageZoomProps,
} from '@likashefqet/react-native-image-zoom';
import React from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const ImageZooms: React.FC<ImageZoomProps> = ({ uri }) => {
  return <ImageZoom uri={uri} isDoubleTapEnabled doubleTapScale={2} />;
};

export default gestureHandlerRootHOC(ImageZooms);
