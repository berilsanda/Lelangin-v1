import React, { Dispatch, SetStateAction } from "react";
import { Text, View, ViewStyle } from "react-native";

import { size } from "src/data/globals";
import RadioButtons from "../atoms/RadioButtons";

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
      {label ? <Text style={{ marginBottom: size.m }}>{label}</Text> : null}
      <View style={{ marginBottom: size.l, ...style }}>
        {data.map((item, index) => {
          let isSelected = value == item.value;
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
