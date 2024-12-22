import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { colors, size, typography } from "data/globals";

interface ButtonsProps {
  label: string;
  onPress: () => void;
  color?: string;
  labelColor?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  mode?: "contained" | "outlined";
  loading?: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({
  label,
  onPress,
  color = colors.primary,
  labelColor = colors.surface,
  style,
  labelStyle,
  disabled = false,
  mode = "contained",
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.btnStyle,
        mode == "contained" ? styles.btnContained : styles.btnOutlined,
        mode == "contained"
          ? { backgroundColor: disabled ? colors.grey.light : color }
          : { borderColor: disabled ? colors.grey.light : color },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            mode == "contained"
              ? disabled
                ? colors.grey.dark
                : labelColor
              : color
          }
          style={{ marginRight: 8 }}
        />
      ) : null}
      <Text
        style={[
          typography.label3,
          styles.labelStyle,
          mode == "contained"
            ? { color: disabled ? colors.grey.dark : labelColor }
            : { color: disabled ? colors.grey.dark : color },
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
    height: size.compHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: size.s,
    paddingVertical: size.s,
    paddingHorizontal: size.l,
    flexDirection: "row",
  },
  btnContained: {},
  btnOutlined: {
    borderWidth: 1,
  },
  labelStyle: {
    textTransform: "capitalize",
  },
});

export default Buttons;
