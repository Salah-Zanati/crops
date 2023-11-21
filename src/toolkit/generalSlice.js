import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessAllow: false,
  activePartAtHome: "workers",
  isFullactToggleGroup: true,
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
  },
  extraReducers: {},
});

export const selectActivePartAtHome = (state) => state.general.activePartAtHome;
export const selectFullactToggle = (state) =>
  state.general.isFullactToggleGroup;

export const { updateAccess, fullactToggle, updateActivePartAtHome } =
  generalSlice.actions;

export default generalSlice.reducer;
