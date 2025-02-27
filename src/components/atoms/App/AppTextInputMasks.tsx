import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';
import { TextInputProps, ViewStyle } from 'react-native';
import {
  TextInputMaskOptionProp,
  TextInputMaskTypeProp,
} from 'react-native-masked-text';

import TextInputMasks from '../TextInputMasks';

interface AppTextInputMasksProps<T extends FieldValues> extends TextInputProps {
  name: string;
  label: string;
  placeholder: string;
  value?: string;
  control: Control<T>;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  defaultValue?: string;
  disabled?: boolean;
  multiline?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  type: TextInputMaskTypeProp;
  options?: TextInputMaskOptionProp | undefined;
}

const AppTextInputMasks = <T extends FieldValues> ({
  name,
  label,
  placeholder,
  value,
  onChangeText,
  control,
  style,
  inputStyle,
  defaultValue,
  disabled = false,
  multiline = false,
  icon,
  type,
  options,
  ...textInputProps
}: AppTextInputMasksProps<T>) => {
  return (
    <Controller
      name={name as Path<T>}
      defaultValue={defaultValue as PathValue<T,Path<T>>}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <>
          <TextInputMasks
            label={label}
            placeholder={placeholder}
            value={value}
            type={type}
            options={options}
            editable={!disabled}
            onChangeText={(maskedValue, rawValue) => onChange(rawValue)}
            onBlur={onBlur}
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

export default AppTextInputMasks;
