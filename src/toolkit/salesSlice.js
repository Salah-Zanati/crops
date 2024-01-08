import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { getDoc } from "firebase/firestore";
import { convertDate } from "../utils/functions";

const initialState = { entities: [], loading: "idle" };

export const getSales = createAsyncThunk(
  "sales/getSales",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/sales`);

      const querySnapshot = await getDocs(collectionRef);
      const data = await Promise.all(
        querySnapshot.docs.map(async (item) => {
          const { customer, veg, currency, date, ...rest } = item.data();
          const customerDoc = await getDoc(customer);
          var customerName = "غير موجود",
            customerId = "00000000000000000000";
          if (customerDoc.exists()) {
            customerName = customerDoc.data().name;
            customerId = customerDoc.id;
          }
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
            customerName,
            vegName,
            currencyName,
            vegId,
            customerId,
            currencyId,
          };
        })
      );
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSales.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getSales.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectSalesEntities = (state) => state.sales.entities;

export const selectSalesLoading = (state) => state.sales.loading;

export default salesSlice.reducer;
