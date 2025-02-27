import { MotiView } from 'moti';
import React from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';

interface SkeletonProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

const Skeleton: React.FC<SkeletonProps> = ({ style: AddOnStyle, ...props }) => {
  return (
    <MotiView
      style={AddOnStyle}
      {...props}
      from={{ backgroundColor: '#ddd' }}
      animate={{ backgroundColor: '#eee' }}
      transition={{
        duration: 1000,
        loop: true,
        repeatReverse: true,
      }}
      entering={FadeIn.springify().damping(80).stiffness(100)}
      exiting={FadeOut.springify().damping(80).stiffness(100)}
    />
  );
};

export default Skeleton;
