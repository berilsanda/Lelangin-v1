import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { NumericFormat } from 'react-number-format';

import { Colors, Spacing, Typography } from '@/config/constant';

interface StepperProps {
  value: number;
  onAdd: () => void;
  onSubstract: () => void;
  cantSubstract: boolean;
  style?: ViewStyle;
  type: 'number' | 'money';
  disabled?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  value,
  onAdd,
  onSubstract,
  cantSubstract,
  style,
  type = 'number',
  disabled,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.btnContainer,
          {
            backgroundColor:
              cantSubstract || disabled
                ? Colors.grey.light
                : Colors.primaryContainer,
          },
        ]}
        activeOpacity={0.8}
        onPress={onSubstract}
        disabled={disabled}
      >
        <MaterialCommunityIcons
          name={'minus'}
          size={20}
          color={cantSubstract || disabled ? Colors.grey.dark : Colors.primary}
          onPress={disabled ? () => {} : onSubstract}
        />
      </TouchableOpacity>
      {type == 'money' ? (
        <NumericFormat
          value={value}
          displayType={'text'}
          prefix={'Rp '}
          thousandSeparator="."
          decimalSeparator=","
          renderText={(val) => <Text style={Typography.paragraph3}>{val}</Text>}
        />
      ) : (
        <Text style={Typography.paragraph3}>{value}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.btnContainer,
          {
            backgroundColor: disabled
              ? Colors.grey.light
              : Colors.primaryContainer,
          },
        ]}
        activeOpacity={0.8}
        onPress={onAdd}
        disabled={disabled}
      >
        <MaterialCommunityIcons
          name={'plus'}
          size={20}
          color={disabled ? Colors.grey.dark : Colors.primary}
          onPress={disabled ? () => {} : onAdd}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Spacing.s,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primaryContainer,
  },
  btnContainer: {
    padding: Spacing.m,
  },
});

export default Stepper;
