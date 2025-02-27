import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  homeUpdateState: false,
};

export const tempSlice = createSlice({
  name: 'temp',
  initialState,
  reducers: {
    toggleHomeUpdate: (state) => {
      state.homeUpdateState = !state.homeUpdateState;
    },
  },
});

export const { toggleHomeUpdate } = tempSlice.actions;

export default tempSlice.reducer;
