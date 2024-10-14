import * as firebase from "firebase/app";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MESSAGE_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "@env";
import uuid from "react-native-uuid";
import { Alert } from "react-native";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const storage = getStorage();

export async function UserLogin(email: string, password: string) {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredentials.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function UserRegister(email: string, password: string) {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredentials.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const database = getFirestore(app);

export const users = collection(database, "user");
export const products = collection(database, "products");
export const bidder = collection(database, "bidder");

export async function createUser(body: any) {
  try {
    await setDoc(doc(database, "user", body.uid), body);
  } catch (error: any) {
    Alert.alert("Kesalahan", error.message);
  }
}

export async function getUser(uid: string): Promise<DocumentData | null> {
  try {
    const docRef = doc(database, "user", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error: any) {
    Alert.alert("Kesalahan", error.message);
    return null;
  }

  return null;
}

interface UpdateUserProps {
  id: string;
  photoURL?: string;
  displayName?: string | null;
}

export async function updateUser({
  id,
  photoURL,
  displayName,
}: UpdateUserProps) {
  try {
    await updateDoc(doc(database, "user", id), {
      photoURL,
      displayName,
      updateAt: new Date(),
    });
  } catch (error: any) {
    Alert.alert("Kesalahan", error.message);
  }
}

export async function addProducts(body: any) {
  try {
    await setDoc(doc(database, "products", body.id), body);
  } catch (error: any) {
    Alert.alert("Kesalahan", error.message);
  }
}

interface AddBidProps {
  id: string;
  currentBid: number;
  userId: string;
}

export async function addBid({ id, currentBid, userId }: AddBidProps) {
  try {
    const bidId = uuid.v4().toString();
    await setDoc(doc(database, "bidder", bidId), {
      auctionId: id,
      bidValue: currentBid,
      createdAt: new Date(),
      userId: userId,
    });

    await updateDoc(doc(database, "products", id), {
      currentBid,
      bidder: arrayUnion(bidId),
    });
  } catch (error: any) {
    Alert.alert("Kesalahan", error.message);
  }
}

export async function addFavourite(id: string, itemId: string) {
  try {
    await updateDoc(doc(database, "user", id), {
      favorites: arrayUnion(itemId),
    });
  } catch (error: any) {
    Alert.alert("Kesalahan", error.message);
  }
}

export async function removeFavourite(id: string, itemId: string) {
  try {
    await updateDoc(doc(database, "user", id), {
      favorites: arrayRemove(itemId),
    });
  } catch (error: any) {
    Alert.alert("Kesalahan", error.message);
  }
}
