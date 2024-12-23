import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { colors, size, typography } from "src/data/globals";

interface AuctionerCardProps {
  image: string;
  name: string;
  city: string;
};

const AuctionerCard: React.FC<AuctionerCardProps> = ({ image, name, city }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <FastImage style={styles.image} source={{ uri: image }} />
      <View>
        <Text style={typography.label3}>{name || "-"}</Text>
        <Text style={styles.city}>{city || "-"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    height: 64,
    marginRight: size.l,
    borderRadius: size.s,
  },
  city: {
    ...typography.paragraph3,
    color: colors.textSecondary,
  },
});

export default AuctionerCard;
