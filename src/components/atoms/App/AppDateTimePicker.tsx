import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Platform, TextInputProps, ViewStyle } from 'react-native';

import TextInputs from '../TextInputs';

interface DatePickerOptions {
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
  is24Hour?: boolean;
  display?: 'default' | 'spinner' | 'calendar' | 'clock';
}

interface AppDateTimePickerProps extends TextInputProps, DatePickerOptions {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  control: Control<any>;
  type?: 'date' | 'time';
  onSelectedDate?: (date: Date | undefined) => void;
  style?: ViewStyle;
}

const AppDateTimePicker: React.FC<AppDateTimePickerProps> = ({
  name,
  label,
  placeholder,
  defaultValue,
  value,
  onChangeText,
  onSelectedDate = () => {},
  control,
  type = 'date',
  style,
  ...props
}) => {
  const [show, setShow] = useState(false);

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextInputs
            label={label}
            placeholder={placeholder}
            value={
              !value
                ? ''
                : moment(value).format(type == 'date' ? 'DD/MM/YYYY' : 'HH:mm')
            }
            onChangeText={onChange}
            readOnly
            icon={type == 'date' ? 'calendar-outline' : 'clock-outline'}
            onPressIcon={() => setShow(true)}
            error={error?.message}
            style={style}
            inputStyle={{ color: 'black' }}
          />

          {show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode={type}
              is24Hour={true}
              display="default"
              {...props}
              onChange={(event, selectedValue) => {
                setShow(Platform.OS === 'ios');

                if (event.type === 'dismissed') {
                  return;
                }

                // Saving value to Controller
                onChange(selectedValue);

                // Selected value will be passed as props
                // to parent component
                onSelectedDate(selectedValue);
              }}
            />
          )}
        </>
      )}
    />
  );
};

export default AppDateTimePicker;
