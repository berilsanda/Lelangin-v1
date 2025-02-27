import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { Dispatch, SetStateAction } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Source } from 'react-native-fast-image';

import ImageItem from './ImageItem';

import { Colors, Spacing, Typography } from '@/config/constant';
import pickImage from '@/utils/imagePicker';

interface PictureListUploaderProps {
  label: string;
  style?: ViewStyle;
  pictureList: Source[];
  setPictureList: Dispatch<SetStateAction<Source[]>>;
  error?: string;
}

const PictureListUploader: React.FC<PictureListUploaderProps> = ({
  pictureList,
  setPictureList,
  error,
}) => {
  const deletePicture = (index: number) => {
    const newList = pictureList.filter((item, idx) => {
      if (idx != index) {
        return item;
      }
      return;
    });

    setPictureList(newList);
  };

  return (
    <View style={{ marginBottom: Spacing.l }}>
      <Text style={{ ...Typography.paragraph3, marginBottom: Spacing.m }}>
        Foto Barang
      </Text>
      <ScrollView horizontal>
        {pictureList.length == 5 ? null : (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={async () => {
              const pickedImage = await pickImage('galery');
              if (pickedImage != null) {
                setPictureList([...pictureList, pickedImage]);
              }
            }}
            activeOpacity={0.5}
          >
            <MaterialCommunityIcons
              name={'plus'}
              size={24}
              color={Colors.primary}
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
    borderRadius: Spacing.s,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    alignSelf: 'flex-start',
    padding: 36,
  },
  errorText: {
    marginTop: Spacing.s,
    color: Colors.warning,
    ...Typography.paragraph3,
  },
});

export default PictureListUploader;
