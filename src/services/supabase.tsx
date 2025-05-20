import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@env';
import { decode } from 'base64-arraybuffer';
import { User } from '@/types/userModel';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function UserRegister(email: string, password: string) {
  try {
    const response = await supabase.auth.signUp({ email, password });
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Uploads a user's image to Supabase Storage.
 *
 * @param image Base64 encoded string of the user's image.
 * @param path Path to upload the image to.
 *
 * @returns A public URL where the image can be accessed.
 *
 * @throws An error if the upload failed.
 */
export async function UploadUserImage(image: string, path: string) {
  try {
    const { error } = await supabase.storage
      .from('user-image')
      .upload(path, decode(image), {
        contentType: 'image/jpeg',
      });
    console.log(error);
    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from('user-image').getPublicUrl(path);

    return data.publicUrl;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function createUser(body: User) {
  try {
    await supabase.from('users').insert(body);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateUser({
  uid,
  display_name,
  photo_url,
}: {
  uid: string;
  display_name: string;
  photo_url: string;
}) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ display_name: display_name, photo_url: photo_url })
      .eq('uid', uid);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function UserLogin(email: string, password: string) {
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export default supabase;
