import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { getDoc } from "firebase/firestore";
import { convertDate } from "../utils/functions";

const initialState = { entities: [], loading: "idle" };

export const getExpenses = createAsyncThunk(
  "expenses/getExpenses",
  async (purchaseId, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(
        database,
        `users/${userId}/purchases/${purchaseId}/expenses`
      );

      const querySnapshot = await getDocs(collectionRef);
      const data = await Promise.all(
        querySnapshot.docs.map(async (item) => {
          const { veg, date, ...rest } = item.data();
          // Fetch the veg document using the reference
          const vegDoc = await getDoc(veg);
          var vegName = "غير موجود",
            vegId = "00000000000000000000";
          if (vegDoc.exists()) {
            vegName = vegDoc.data().name;
            vegId = vegDoc.id;
          }

          const theDate = convertDate(date.toMillis());

          return {
            ...rest,
            id: item.id,
            date: theDate,
            vegName,
            vegId,
          };
        })
      );
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectExpensesEntities = (state) => state.expenses.entities;

export const selectExpensesLoading = (state) => state.expenses.loading;

export default expensesSlice.reducer;
