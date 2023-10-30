import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";

const initialState = { entities: [], loading: "idle" };

const collectionRef = collection(database, "vegs");

export const getVegs = createAsyncThunk(
  "vegs/getVegs",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/vegs`);

      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
);

const vegsSlice = createSlice({
  name: "vegs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVegs.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getVegs.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectVegsEntities = (state) => state.vegs.entities;
export const selectVegsLoading = (state) => state.vegs.loading;

export default vegsSlice.reducer;
