import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessAllow: false,
  activePartAtHome: "workers",
  isFullactToggleGroup: true,
  username: "",
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
    fullactToggle(state, action) {
      state.isFullactToggleGroup = action.payload;
    },
    saveUsername(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: {},
});

export const selectActivePartAtHome = (state) => state.general.activePartAtHome;
export const username = (state) => state.general.username;
export const selectFullactToggle = (state) =>
  state.general.isFullactToggleGroup;

export const {
  updateAccess,
  fullactToggle,
  updateActivePartAtHome,
  updateActivePartAtSidebar,
  saveUsername,
} = generalSlice.actions;

export default generalSlice.reducer;
