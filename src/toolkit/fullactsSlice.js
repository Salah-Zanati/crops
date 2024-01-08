import { collection, getDoc, getDocs } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { convertDate } from "../utils/functions";

const initialState = { entities: [], loading: "idle" };

export const getFullacts = createAsyncThunk(
  "fullacts/getFullacts",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/fullacts`);

      const querySnapshot = await getDocs(collectionRef);
      const data = await Promise.all(
        querySnapshot.docs.map(async (item) => {
          let { act, veg, date, currency, ...rest } = item.data();
          // Fetch the act document and veg document using the reference
          if (typeof act !== "string") act = "غير موجود";

          const vegDoc = await getDoc(veg);
          var vegName = "غير موجود",
            vegId = "00000000000000000000";
          if (vegDoc.exists()) {
            vegName = vegDoc.data().name;
            vegId = vegDoc.id;
          }
          var currencyName = "غير موجود",
            currencyId = "00000000000000000000";
          if (currency) {
            const currencyDoc = await getDoc(currency);
            if (currencyDoc.exists()) {
              currencyName = currencyDoc.data().name;
              currencyId = currencyDoc.id;
            }
          }

          const theDate = convertDate(date.toMillis());

          return {
            ...rest,
            id: item.id,
            date: theDate,
            vegName,
            currencyName,
            vegId,
            currencyId,
            act,
          };
        })
      );
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
);

const fullactsSlice = createSlice({
  name: "fullacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFullacts.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getFullacts.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectFullactEntities = (state) => state.fullacts.entities;
export const selectFullactLoading = (state) => state.fullacts.loading;

export default fullactsSlice.reducer;
