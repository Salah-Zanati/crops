import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";

const initialState = { entities: [], loading: "idle" };

export const getMaterial = createAsyncThunk(
  "material/getMaterial",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/material`);

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

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMaterial.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getMaterial.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectMaterialEntities = (state) => state.material.entities;
export const selectMaterialLoading = (state) => state.material.loading;

export default materialSlice.reducer;
