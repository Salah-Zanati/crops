import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessAllow: false,
  activePartAtHome: "workers",
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    updateAccess(state) {
      state.accessAllow = !state.accessAllow;
    },
    updateActivePartAtHome(state, action) {
      state.activePartAtHome = action.payload;
    },
    updateActivePartAtSidebar(state, action) {
      state.activePartAtHome = action.payload;
    },
  },
  extraReducers: {},
});

export const selectActivePartAtHome = (state) => state.general.activePartAtHome;

export const { updateAccess, updateActivePartAtHome } = generalSlice.actions;

export default generalSlice.reducer;
