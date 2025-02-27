import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {
  TextInputMask,
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from 'react-native-masked-text';

import { Colors, Spacing, Typography } from '@/config/constant';

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
  type = 'only-numbers',
  options,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.viewStyles, style]}>
      {label ? (
        <Text style={{ ...Typography.paragraph3, marginBottom: Spacing.m }}>
          {label}
        </Text>
      ) : null}
      <View style={{ justifyContent: 'center' }}>
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
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={Colors.grey.dark}
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

export default TextInputMasks;
