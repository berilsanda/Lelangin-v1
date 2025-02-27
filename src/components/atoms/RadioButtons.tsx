import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Colors, Spacing, Typography } from '@/config/constant';

interface RadioButtonsProps<T,> {
  label: string;
  index: number;
  isSelected: boolean;
  setValue: (value: T) => void;
  value: T;
}

const RadioButtons = <T,>({
  label,
  index,
  isSelected,
  setValue,
  value,
}: RadioButtonsProps<T>) => {
  return (
    <TouchableOpacity
      key={index}
      style={styles.radioContainer}
      onPress={() => setValue(value)}
    >
      <View
        style={[
          styles.outerRadio,
          {
            borderColor: isSelected ? Colors.primary : Colors.grey.dark,
          },
        ]}
      >
        <View
          style={[styles.innerRadio, { display: isSelected ? 'flex' : 'none' }]}
        />
      </View>
      <Text style={Typography.paragraph3}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.m,
    marginRight: Spacing.l,
  },
  outerRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.m,
    height: Spacing.l,
    width: Spacing.l,
    borderWidth: 1,
    borderRadius: Spacing.l / 2,
  },
  innerRadio: {
    height: Spacing.m,
    width: Spacing.m,
    backgroundColor: Colors.primary,
    borderRadius: Spacing.m / 2,
  },
});

export default RadioButtons;
