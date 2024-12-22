import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import uuid from "react-native-uuid";

import { colors, size, typography } from "src/data/globals";
import {
  AppTextInputs,
  AppTextInputMasks,
  Buttons,
} from "src/components/atoms";
import AppDateTimePicker from "src/components/atoms/App/AppDateTimePicker";
import PictureListUploader from "src/components/molecules/PictureListUploader/PictureListUploader";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { addProducts } from "src/services/firebase";
import { STORAGE_BUCKET } from "@env";
import uploadImageAsync from "src/services/uploadImageAsync";
import { StackParamList } from "src/navigations/MainNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import combineDateTime from "src/utils/combineDateTime";
import { toggleHomeUpdate } from "src/reduxs/reducer/tempReducer";
import RadioGroups from "src/components/molecules/RadioGroups";

type FormData = {
  pictureList: string[];
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
    .of(yup.string().required())
    .min(1, "Foto tidak boleh kosong.")
    .required("Harap pilih foto."),
  title: yup.string().required("Silahkan isi nama barang."),
  description: yup.string().required("Silahkan masukkan deskripsi barang."),
  conditions: yup.string().required('Silahkan pilih kondisi barang.'),
  startingBid: yup
    .number()
    .required("Silahkan masukkan harga awal.")
    .min(1000, "Minimal harga awal Rp 1.000")
    .test(
      "is-divisible-by-100",
      "Masukkan nilai yang dapat dibagi 100.",
      (value) => {
        return value % 100 === 0;
      }
    ),
  stepBid: yup
    .number()
    .required("Silahkan masukkan kelipatan harga.")
    .min(1000, "Minimal kelipatan harga Rp 1.000")
    .test(
      "is-divisible-by-100",
      "Masukkan nilai yang dapat dibagi 100.",
      (value) => {
        return value % 100 === 0;
      }
    ),
  timeAuctionEnd: yup.string().required("Silahkan pilih jam berakhir lelang."),
  dateAuctionEnd: yup
    .string()
    .required("Silahkan pilih tanggal berakhir lelang.")
    .test(
      "dateInNotPast",
      "Tidak bisa pilih tanggal kemarin.",
      (value) => !value || moment(value).isSameOrAfter(moment(), "day")
    ),
});

type Props = NativeStackScreenProps<StackParamList, "TambahLelang">;

export default function AddAuction({ navigation }: Props) {
  // Todo :
  // - add loading spinner animations

  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const userData = useSelector((state: any) => state.persist.userData);

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      let productId = uuid.v4();

      // upload image
      const pathToUpload = `Product/${productId}/Images`;
      const imageList = await Promise.all(
        data.pictureList.map(async (picture) => {
          let image = picture;
          if (!picture.includes(STORAGE_BUCKET)) {
            const imageId = uuid.v4();
            image = await uploadImageAsync(
              picture,
              pathToUpload,
              `image ${imageId}`
            );
          }
          return image;
        })
      );

      let sendData = {
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
        status: "active",
        stepBid: data.stepBid && data.stepBid > 1000 ? data.stepBid : 1000,
        title: data.title,
        winner: null,
      };

      await addProducts(sendData);
      dispatch(toggleHomeUpdate());

      reset();
      Alert.alert("Berhasil", "Lelang anda berhasil ditambah!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Kesalahan", error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: size.l }}
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
                  { label: "Baru", value: "new" },
                  { label: "Bekas", value: "used" },
                ]}
                value={value}
                setValue={onChange}
                style={{ flexDirection: "row" }}
              />
              {error ? (
                <Text style={styles.errorText}>{error.message}</Text>
              ) : null}
            </>
          )}
        />

        <View style={styles.separator} />

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
            separator: "",
            delimiter: ".",
            unit: "Rp ",
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
            separator: "",
            delimiter: ".",
            unit: "Rp ",
          }}
        />

        <View style={styles.separator} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppDateTimePicker
            name="timeAuctionEnd"
            label="Jam Berakhir"
            placeholder="Pilih Jam"
            control={control}
            type="time"
            style={{ flex: 1, marginRight: size.l }}
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
    paddingHorizontal: size.xl,
    paddingVertical: size.l,
  },
  bottomBtnContainer: {
    paddingVertical: size.l,
    paddingHorizontal: size.xl,
    borderTopWidth: 1,
    borderColor: colors.grey.light,
  },
  separator: {
    marginBottom: size.l,
    borderTopWidth: 1,
    borderColor: colors.grey.light,
  },
  errorText: {
    marginTop: size.s,
    color: colors.warning,
    ...typography.paragraph3,
  },
});
