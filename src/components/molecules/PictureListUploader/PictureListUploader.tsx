import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { colors, size, typography } from "src/data/globals";
import ImageItem from "./ImageItem";
import pickImage from "src/utils/imagePicker";

interface PictureListUploaderProps {
  label: string;
  style?: ViewStyle;
  pictureList: string[];
  setPictureList: Dispatch<SetStateAction<string[]>>;
  error?: string;
}

const PictureListUploader: React.FC<PictureListUploaderProps> = ({
  pictureList,
  setPictureList,
  error,
}) => {
  const deletePicture = (index: number) => {
    let newList = pictureList.filter((item, idx) => {
      if (idx != index) {
        return item;
      }
      return;
    });

    setPictureList(newList);
  };

  return (
    <View style={{ marginBottom: size.l }}>
      <Text style={{ ...typography.paragraph3, marginBottom: size.m }}>
        Foto Barang
      </Text>
      <ScrollView horizontal>
        {pictureList.length == 5 ? null : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={async () => {
              let pickedImage = await pickImage("galery");
              if (pickedImage != null) {
                setPictureList([...pictureList, pickedImage]);
              }
            }}
            activeOpacity={0.5}
          >
            <MaterialCommunityIcons
              name={"plus"}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
        {pictureList.length > 0
          ? pictureList.map((item, index) => {
              return (
                <ImageItem
                  key={index}
                  picture={item}
                  index={index}
                  deletePicture={deletePicture}
                />
              );
            })
          : null}
      </ScrollView>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    borderWidth: 1,
    borderRadius: size.s,
    borderStyle: "dashed",
    borderColor: colors.primary,
    alignSelf: "flex-start",
    padding: 36,
  },
  errorText: {
    marginTop: size.s,
    color: colors.warning,
    ...typography.paragraph3,
  },
});

export default PictureListUploader;
