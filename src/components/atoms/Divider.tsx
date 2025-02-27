import React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { Colors, Spacing } from '@/config/constant';

interface DividerProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

const Divider: React.FC<DividerProps> = ({ style: AddOnStyle }) => {
  return <View style={[styles.separator, AddOnStyle]} />;
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: Spacing.l,
    borderTopWidth: 1,
    borderColor: Colors.grey.light,
  },
});

export default Divider;
