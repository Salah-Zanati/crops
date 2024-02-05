import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessAllow: false,
  activePartAtHome: "workers",
  isFullactToggleGroup: true,
  user: { name: "" },
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
    saveUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: {},
});

export const selectActivePartAtHome = (state) => state.general.activePartAtHome;
export const user = (state) => state.general.user;
export const selectFullactToggle = (state) =>
  state.general.isFullactToggleGroup;

export const {
  updateAccess,
  fullactToggle,
  updateActivePartAtHome,
  updateActivePartAtSidebar,
  saveUser,
} = generalSlice.actions;

export default generalSlice.reducer;
