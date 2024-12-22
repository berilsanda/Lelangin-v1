import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { colors, size, typography } from "data/globals";

interface TextInputsProps extends TextInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  defaultValue?: string;
  disabled?: boolean;
  multiline?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: string;
  onPressIcon?: () => void;
}

const TextInputs: React.FC<TextInputsProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  inputStyle,
  defaultValue,
  disabled = false,
  multiline = false,
  icon,
  onBlur,
  error,
  onPressIcon,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <View style={[styles.viewStyles, style]}>
      {label ? <Text style={{...typography.paragraph3, marginBottom: size.m }}>{label}</Text> : null}
      <View style={{ justifyContent: "center" }}>
        <TextInput
          placeholder={placeholder}
          defaultValue={defaultValue}
          editable={!disabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          secureTextEntry={showPassword}
          style={[
            typography.paragraph3,
            styles.inputStyles,
            {
              paddingVertical: multiline ? 10 : 5,
              borderColor: error
                ? colors.warning
                : isFocused
                ? colors.primary
                : colors.grey.light,
            },
            inputStyle,
          ]}
          selectionColor={colors.primaryContainer}
          cursorColor={colors.primary}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          {...textInputProps}
        />
        {icon && !secureTextEntry ? (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors.grey.dark}
            onPress={onPressIcon}
            style={styles.iconStyles}
          />
        ) : null}
        {secureTextEntry ? (
          <MaterialCommunityIcons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={colors.grey.dark}
            onPress={togglePasswordVisibility}
            style={styles.iconStyles}
          />
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  viewStyles: {
    marginBottom: size.l,
  },
  inputStyles: {
    paddingHorizontal: size.l,
    borderWidth: 1,
    borderRadius: size.s,
  },
  iconStyles: {
    position: "absolute",
    right: size.l
  },
  errorText: {
    marginTop: size.s,
    color: colors.warning,
    ...typography.paragraph3
  },
});

export default TextInputs;
