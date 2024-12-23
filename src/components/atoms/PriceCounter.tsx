import { View } from "moti";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NumericFormat } from "react-number-format";

import { colors, typography } from "src/data/globals";

interface PriceCounterProps {
  bidValue: number;
}

const PriceCounter: React.FC<PriceCounterProps> = ({ bidValue }) => {
  const [currBid, setCurrBid] = useState(bidValue);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withTiming(-50, { duration: 250 }, () => {
      runOnJS(setCurrBid)(bidValue);
      translateY.value = 50;
      translateY.value = withTiming(0, { duration: 250 });
    });
  }, [bidValue]);

  return (
    <NumericFormat
      value={currBid}
      displayType={"text"}
      prefix={"Rp "}
      thousandSeparator="."
      decimalSeparator=","
      renderText={(val) => (
        <View style={{ overflow: "hidden" }}>
          <Animated.Text style={[styles.bidValue, animatedStyle]}>
            {val}
          </Animated.Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  bidValue: {
    ...typography.heading2,
    color: colors.warning,
  },
});

export default PriceCounter;
