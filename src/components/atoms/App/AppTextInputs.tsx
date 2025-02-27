import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';
import { TextInputProps, ViewStyle } from 'react-native';

import TextInputs from '../TextInputs';
interface AppTextInputsProps<T extends FieldValues> extends TextInputProps {
  name: string;
  label: string;
  placeholder: string;
  value?: string;
  control: Control<T>;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  defaultValue?: string;
  disabled?: boolean;
  multiline?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

const AppTextInputs = <T extends FieldValues>({
  name,
  label,
  placeholder,
  value,
  onChangeText,
  control,
  secureTextEntry = false,
  style,
  inputStyle,
  defaultValue,
  disabled = false,
  multiline = false,
  icon,
  ...textInputProps
}: AppTextInputsProps<T>) => {
  return (
    <Controller
      name={name as Path<T>}
      defaultValue={defaultValue as PathValue<T, Path<T>>}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <TextInputs
            label={label}
            placeholder={placeholder}
            value={value}
            editable={!disabled}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            style={style}
            inputStyle={inputStyle}
            disabled={disabled}
            multiline={multiline}
            icon={icon}
            error={error?.message}
            {...textInputProps}
          />
        </>
      )}
    />
  );
};

export default AppTextInputs;
