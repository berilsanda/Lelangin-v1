import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { colors, size, typography } from "src/data/globals";

interface RadioButtonsProps {
  label: string;
  index: number;
  isSelected: boolean;
  setValue: (value: any) => void;
  value: any;
}

const RadioButtons: React.FC<RadioButtonsProps> = ({
  label,
  index,
  isSelected,
  setValue,
  value,
}) => {
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
            borderColor: isSelected ? colors.primary : colors.grey.dark,
          },
        ]}
      >
        <View
          style={[styles.innerRadio, { display: isSelected ? "flex" : "none" }]}
        />
      </View>
      <Text style={typography.paragraph3}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: size.m,
    marginRight: size.l,
  },
  outerRadio: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: size.m,
    height: size.l,
    width: size.l,
    borderWidth: 1,
    borderRadius: size.l / 2,
  },
  innerRadio: {
    height: size.m,
    width: size.m,
    backgroundColor: colors.primary,
    borderRadius: size.m / 2,
  },
});

export default RadioButtons;
