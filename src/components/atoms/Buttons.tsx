import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { Colors, Spacing, Typography } from '@/config/constant';

interface ButtonsProps {
  label: string;
  onPress: () => void;
  color?: string;
  labelColor?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  mode?: 'contained' | 'outlined';
  loading?: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({
  label,
  onPress,
  color = Colors.primary,
  labelColor = Colors.surface,
  style,
  labelStyle,
  disabled = false,
  mode = 'contained',
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.btnStyle,
        mode == 'contained' ? styles.btnContained : styles.btnOutlined,
        mode == 'contained'
          ? { backgroundColor: disabled ? Colors.grey.light : color }
          : { borderColor: disabled ? Colors.grey.light : color },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            mode == 'contained'
              ? disabled
                ? Colors.grey.dark
                : labelColor
              : color
          }
          style={{ marginRight: 8 }}
        />
      ) : null}
      <Text
        style={[
          Typography.label3,
          styles.labelStyle,
          mode == 'contained'
            ? { color: disabled ? Colors.grey.dark : labelColor }
            : { color: disabled ? Colors.grey.dark : color },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    height: Spacing.compHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.s,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.l,
    flexDirection: 'row',
  },
  btnContained: {},
  btnOutlined: {
    borderWidth: 1,
  },
  labelStyle: {
    textTransform: 'capitalize',
  },
});

export default Buttons;
