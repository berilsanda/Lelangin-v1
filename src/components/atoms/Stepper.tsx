import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NumericFormat } from "react-number-format";

import { colors, size, typography } from "src/data/globals";

interface StepperProps {
  value: number;
  onAdd: () => void;
  onSubstract: () => void;
  cantSubstract: boolean;
  style?: ViewStyle;
  type: "number" | "money";
  disabled?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  value,
  onAdd,
  onSubstract,
  cantSubstract,
  style,
  type = "number",
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
                ? colors.grey.light
                : colors.primaryContainer,
          },
        ]}
        activeOpacity={0.8}
        onPress={onSubstract}
        disabled={disabled}
      >
        <MaterialCommunityIcons
          name={"minus"}
          size={20}
          color={cantSubstract || disabled ? colors.grey.dark : colors.primary}
          onPress={disabled ? () => {} : onSubstract}
        />
      </TouchableOpacity>
      {type == "money" ? (
        <NumericFormat
          value={value}
          displayType={"text"}
          prefix={"Rp "}
          thousandSeparator="."
          decimalSeparator=","
          renderText={(val) => <Text style={typography.paragraph3}>{val}</Text>}
        />
      ) : (
        <Text style={typography.paragraph3}>{value}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.btnContainer,
          {
            backgroundColor: disabled
              ? colors.grey.light
              : colors.primaryContainer,
          },
        ]}
        activeOpacity={0.8}
        onPress={onAdd}
        disabled={disabled}
      >
        <MaterialCommunityIcons
          name={"plus"}
          size={20}
          color={disabled ? colors.grey.dark : colors.primary}
          onPress={disabled ? () => {} : onAdd}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: size.s,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.primaryContainer,
  },
  btnContainer: {
    padding: size.m,
  },
});

export default Stepper;
