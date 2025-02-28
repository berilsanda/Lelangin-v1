import { STORAGE_BUCKET } from '@env';
import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Source } from 'react-native-fast-image';
import uuid from 'react-native-uuid';
import {
  AppTextInputs,
  AppTextInputMasks,
  Buttons,
  Divider,
  AppDateTimePicker,
} from 'src/components/atoms';
import { PictureListUploader, RadioGroups } from 'src/components/molecules';
import { AddProduct, addProducts } from 'src/services/firebase';
import uploadImageAsync from 'src/services/uploadImageAsync';
import combineDateTime from 'src/utils/combineDateTime';
import * as yup from 'yup';

import { Colors, Spacing, Typography } from '@/config/constant';
import { toggleHomeUpdate } from '@/stores/reducer/tempReducer';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { StackParamList } from '@/types/navigation/MainNavigationType';

type FormData = {
  pictureList: Source[];
  title: string;
  description: string;
  conditions: string;
  startingBid: number;
  stepBid: number;
  timeAuctionEnd: string;
  dateAuctionEnd: string;
};

const schema = yup.object().shape({
  pictureList: yup
    .array()
    .of(
      yup.object({
        uri: yup.string(),
      }),
    )
    .required()
    .min(1, 'Foto tidak boleh kosong.')
    .required('Harap pilih foto.'),
  title: yup.string().required('Silahkan isi nama barang.'),
  description: yup.string().required('Silahkan masukkan deskripsi barang.'),
  conditions: yup.string().required('Silahkan pilih kondisi barang.'),
  startingBid: yup
    .number()
    .required('Silahkan masukkan harga awal.')
    .min(1000, 'Minimal harga awal Rp 1.000')
    .test(
      'is-divisible-by-100',
      'Masukkan nilai yang dapat dibagi 100.',
      (value) => {
        return value % 100 === 0;
      },
    ),
  stepBid: yup
    .number()
    .required('Silahkan masukkan kelipatan harga.')
    .min(1000, 'Minimal kelipatan harga Rp 1.000')
    .test(
      'is-divisible-by-100',
      'Masukkan nilai yang dapat dibagi 100.',
      (value) => {
        return value % 100 === 0;
      },
    ),
  timeAuctionEnd: yup.string().required('Silahkan pilih jam berakhir lelang.'),
  dateAuctionEnd: yup
    .string()
    .required('Silahkan pilih tanggal berakhir lelang.')
    .test(
      'dateInNotPast',
      'Tidak bisa pilih tanggal kemarin.',
      (value) => !value || moment(value).isSameOrAfter(moment(), 'day'),
    ),
});

type Props = NativeStackScreenProps<StackParamList, 'TambahLelang'>;

export default function AddAuction({ navigation }: Props) {
  // Todo :
  // - add loading spinner animations

  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const userData = useAppSelector((state) => state.persist.userData);

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const productId = uuid.v4().toString();

      // upload image
      const pathToUpload = `Product/${productId}/Images`;
      const imageList = await Promise.all(
        data.pictureList.map(async (picture) => {
          const image = picture;
          if (!picture.uri!.includes(STORAGE_BUCKET)) {
            const imageId = uuid.v4();
            image.uri = await uploadImageAsync(
              picture.uri!,
              pathToUpload,
              `image ${imageId}`,
            );
          }
          return image;
        }),
      );

      const sendData: AddProduct = {
        id: productId,
        auctionEnd: combineDateTime(data.dateAuctionEnd, data.timeAuctionEnd),
        bidder: [],
        condition: data.conditions,
        createdAt: new Date(),
        createdBy: userData.uid,
        currentBid: 0,
        description: data.description,
        images: imageList,
        startingBid: data.startingBid,
        status: 'active',
        stepBid: data.stepBid && data.stepBid > 1000 ? data.stepBid : 1000,
        title: data.title,
        winner: null,
      };

      await addProducts(sendData);
      dispatch(toggleHomeUpdate());

      reset();
      Alert.alert('Berhasil', 'Lelang anda berhasil ditambah!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Kesalahan', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: Spacing.l }}
      >
        <Controller
          name="pictureList"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <PictureListUploader
              label="Foto Barang"
              pictureList={value}
              setPictureList={(newList) => onChange(newList)}
              error={error?.message}
            />
          )}
        />
        <AppTextInputs
          name="title"
          label="Nama Barang"
          placeholder="Masukkan nama barang"
          control={control}
          disabled={loading}
        />
        <AppTextInputs
          name="description"
          label="Deskripsi Barang"
          placeholder="Masukkan deskripsi barang"
          control={control}
          disabled={loading}
          multiline
          numberOfLines={5}
          maxLength={320}
        />

        <Controller
          name="conditions"
          control={control}
          defaultValue={'new'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <RadioGroups
                label="Kondisi Barang"
                data={[
                  { label: 'Baru', value: 'new' },
                  { label: 'Bekas', value: 'used' },
                ]}
                value={value}
                setValue={onChange}
                style={{ flexDirection: 'row' }}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </>
          )}
        />

        <Divider />

        <AppTextInputMasks
          name="startingBid"
          label="Harga Awal"
          placeholder="Masukkan harga awal"
          control={control}
          disabled={loading}
          keyboardType="numeric"
          type="money"
          options={{
            precision: 0,
            separator: '',
            delimiter: '.',
            unit: 'Rp ',
          }}
        />
        <AppTextInputMasks
          name="stepBid"
          label="Kelipatan Harga (Default Rp 1.000)"
          placeholder="Masukkan kelipatan harga lelang"
          control={control}
          disabled={loading}
          keyboardType="numeric"
          type="money"
          defaultValue="1000"
          options={{
            precision: 0,
            separator: '',
            delimiter: '.',
            unit: 'Rp ',
          }}
        />

        <Divider />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppDateTimePicker
            name="timeAuctionEnd"
            label="Jam Berakhir"
            placeholder="Pilih Jam"
            control={control}
            type="time"
            style={{ flex: 1, marginRight: Spacing.l }}
          />
          <AppDateTimePicker
            name="dateAuctionEnd"
            label="Tanggal Berakhir"
            placeholder="Pilih Tanggal"
            control={control}
            type="date"
            style={{ flex: 1 }}
            minimumDate={new Date()}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomBtnContainer}>
        <Buttons
          label="Tambah Lelang"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.l,
  },
  bottomBtnContainer: {
    paddingVertical: Spacing.l,
    paddingHorizontal: Spacing.xl,
    borderTopWidth: 1,
    borderColor: Colors.grey.light,
  },
  separator: {
    marginBottom: Spacing.l,
    borderTopWidth: 1,
    borderColor: Colors.grey.light,
  },
  errorText: {
    marginTop: Spacing.s,
    color: Colors.warning,
    ...Typography.paragraph3,
  },
});
