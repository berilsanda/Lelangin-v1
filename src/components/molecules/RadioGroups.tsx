import React, { Dispatch, SetStateAction } from 'react';
import { Text, View, ViewStyle } from 'react-native';

import RadioButtons from '../atoms/RadioButtons';

import { Spacing } from '@/config/constant';

interface RadioGroupsProps<T> {
  label?: string;
  data: { label: string; value: T }[];
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  style?: ViewStyle;
}

const RadioGroups = <T,>({
  label,
  data,
  value,
  setValue,
  style,
}: RadioGroupsProps<T>) => {
  return (
    <View>
      {label ? <Text style={{ marginBottom: Spacing.m }}>{label}</Text> : null}
      <View style={{ marginBottom: Spacing.l, ...style }}>
        {data.map((item, index) => {
          const isSelected = value == item.value;
          return (
            <RadioButtons
              key={index}
              index={index}
              isSelected={isSelected}
              label={item.label}
              setValue={(value) => setValue(value)}
              value={item.value}
            />
          );
        })}
      </View>
    </View>
  );
};

export default RadioGroups;
