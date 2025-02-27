import React, { Dispatch, SetStateAction } from 'react';
import { Text, View, ViewStyle } from 'react-native';

import RadioButtons from '../atoms/RadioButtons';

import { Spacing } from '@/config/constant';

interface RadioGroupsProps {
  label?: string;
  data: { label: string; value: any }[];
  value: any;
  setValue: Dispatch<SetStateAction<any>>;
  style?: ViewStyle;
}

const RadioGroups: React.FC<RadioGroupsProps> = ({
  label,
  data,
  value,
  setValue,
  style,
}) => {
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
