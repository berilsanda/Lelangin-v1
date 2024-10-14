import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userData: {
    uid: "",
    email: "",
    emailVerified: false,
    displayName: "",
    photoURL: "",
    address: {
      city: '',
      streetAddress: '',
      zipCode: '',
    },
    createdAt: '',
    favorites: [] as string[],
    lastLogin:'',
    phoneNumber: '',
    updateAt: '',
  },
};

export const persistSlice = createSlice({
  name: "persist",
  initialState,
  reducers: {
    setUser: (state, action) => {
      let newUserData = { ...state.userData, ...action.payload };
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
        (fav) => fav !== action.payload
      );
    },
  },
});

export const { setUser, resetUser, addRdxFavourite, removeRdxFavourite } = persistSlice.actions;

export default persistSlice.reducer;
