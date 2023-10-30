import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";

const initialState = { entities: [], loading: "idle" };

export const getActs = createAsyncThunk(
  "acts/getActs",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/acts`);

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

const actsSlice = createSlice({
  name: "acts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActs.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getActs.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectActsEntities = (state) => state.acts.entities;
export const selectActsLoading = (state) => state.acts.loading;

export default actsSlice.reducer;
