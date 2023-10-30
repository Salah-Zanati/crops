import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";

const initialState = { entities: [], loading: "idle" };

export const getGroups = createAsyncThunk(
  "groups/getGroups",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/groups`);

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

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGroups.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectGroupsEntities = (state) => state.groups.entities;
export const selectGroupsLoading = (state) => state.groups.loading;

export default groupsSlice.reducer;
