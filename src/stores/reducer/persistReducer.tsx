import { User } from '@/types/userModel';
import { createSlice } from '@reduxjs/toolkit';
import { Session } from '@supabase/supabase-js';

type PersistState = {
  session: Session | null;
  userData: Omit<User, 'created_at' | 'last_login' | 'updated_at'> & {
    created_at: string;
    last_login: string;
    updated_at: string;
  };
};

export const INITIAL_USER = {
  uid: '',
  email: '',
  display_name: '',
  photo_url: '',
  address_city: '',
  address_street_address: '',
  address_zip_code: '',
  favorites: [],
  phone_number: 0,
  created_at: '',
  last_login: '',
  updated_at: '',
}

const initialState: PersistState = {
  session: null,
  userData: INITIAL_USER,
};

export const persistSlice = createSlice({
  name: 'persist',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setUser: (state, action) => {
      const newUserData = { ...state.userData, ...action.payload };
      state.userData = newUserData;
    },
    resetUser: (state) => {
      state.userData = initialState.userData;
    },
    addRdxFavourite: (state, action) => {
      if (!state.userData.favorites.includes(action.payload)) {
        state.userData.favorites.push(action.payload);
      }
    },
    removeRdxFavourite: (state, action) => {
      state.userData.favorites = state.userData.favorites.filter(
        (fav) => fav !== action.payload,
      );
    },
  },
});

export const {
  setSession,
  setUser,
  resetUser,
  addRdxFavourite,
  removeRdxFavourite,
} = persistSlice.actions;

export default persistSlice.reducer;
