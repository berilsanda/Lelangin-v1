import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
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
} from 'react-native';

import { Colors, Spacing, Typography } from '@/config/constant';

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
      {label ? (
        <Text style={{ ...Typography.paragraph3, marginBottom: Spacing.m }}>
          {label}
        </Text>
      ) : null}
      <View style={{ justifyContent: 'center' }}>
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
            Typography.paragraph3,
            styles.inputStyles,
            {
              paddingVertical: multiline ? 10 : 5,
              borderColor: error
                ? Colors.warning
                : isFocused
                  ? Colors.primary
                  : Colors.grey.light,
            },
            inputStyle,
          ]}
          selectionColor={Colors.primaryContainer}
          cursorColor={Colors.primary}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...textInputProps}
        />
        {icon && !secureTextEntry ? (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={Colors.grey.dark}
            onPress={onPressIcon}
            style={styles.iconStyles}
          />
        ) : null}
        {secureTextEntry ? (
          <MaterialCommunityIcons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={Colors.grey.dark}
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
    marginBottom: Spacing.l,
  },
  inputStyles: {
    paddingHorizontal: Spacing.l,
    borderWidth: 1,
    borderRadius: Spacing.s,
  },
  iconStyles: {
    position: 'absolute',
    right: Spacing.l,
  },
  errorText: {
    marginTop: Spacing.s,
    color: Colors.warning,
    ...Typography.paragraph3,
  },
});

export default TextInputs;
