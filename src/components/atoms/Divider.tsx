import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { colors, size } from "src/data/globals";

interface DividerProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

const Divider: React.FC<DividerProps> = ({ style: AddOnStyle }) => {
  return <View style={[styles.separator, AddOnStyle]} />;
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: size.l,
    borderTopWidth: 1,
    borderColor: colors.grey.light,
  },
});

export default Divider;
