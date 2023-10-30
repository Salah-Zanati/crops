import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";

const initialState = { entities: [], loading: "idle" };

export const getCustomers = createAsyncThunk(
  "customers/getCustomers",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/customers`);

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

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectCustomersEntities = (state) => state.customers.entities;

export const selectCustomersLoading = (state) => state.customers.loading;

export default customersSlice.reducer;
