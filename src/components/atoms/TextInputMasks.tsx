import React, { useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  TextInputMask,
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from "react-native-masked-text";

import { colors, size, typography } from "data/globals";

interface TextInputMasksProps extends TextInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (maskedText: string, rawText?: string) => void;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  defaultValue?: string;
  disabled?: boolean;
  multiline?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: string;
  onPressIcon?: () => void;
  type: TextInputMaskTypeProp;
  options?: TextInputMaskOptionProp | undefined;
}

const TextInputMasks: React.FC<TextInputMasksProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  style,
  inputStyle,
  defaultValue,
  disabled = false,
  multiline = false,
  icon,
  onBlur,
  error,
  onPressIcon,
  type = "only-numbers",
  options,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.viewStyles, style]}>
      {label ? (
        <Text style={{ ...typography.paragraph3, marginBottom: size.m }}>
          {label}
        </Text>
      ) : null}
      <View style={{ justifyContent: "center" }}>
        <TextInputMask
          placeholder={placeholder}
          defaultValue={defaultValue}
          editable={!disabled}
          value={value}
          type={type}
          options={options}
          includeRawValueInChangeText={true}
          onChangeText={(maskedText, rawText) =>
            onChangeText(maskedText, rawText)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          style={[
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
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors.grey.dark}
            onPress={onPressIcon}
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
    right: size.l,
  },
  errorText: {
    marginTop: size.s,
    color: colors.warning,
    ...typography.paragraph3,
  },
});

export default TextInputMasks;
