import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import uuid from 'react-native-uuid';

import { storage } from './firebase';

export default async function uploadImageAsync(
  sourceUri: string,
  pathToUpload: string,
  fileName: string,
) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', sourceUri, true);
    xhr.send(null);
  });
  const uploadPath = pathToUpload + '/' + (fileName || uuid.v4());
  const storageRef = ref(storage, uploadPath);
  const snapshot = await uploadBytesResumable(storageRef, blob);

  return getDownloadURL(snapshot.ref);
}
