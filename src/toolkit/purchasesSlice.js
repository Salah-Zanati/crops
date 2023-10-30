import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { getDoc } from "firebase/firestore";
import { convertDate } from "../utils/functions";

const initialState = { entities: [], loading: "idle" };

export const getPurchases = createAsyncThunk(
  "purchases/getPurchases",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/purchases`);

      const querySnapshot = await getDocs(collectionRef);
      const data = await Promise.all(
        querySnapshot.docs.map(async (item) => {
          const { seller, material, veg, date, ...rest } = item.data();
          // Fetch the seller document and material document using the reference
          const sellerDoc = await getDoc(seller);
          var sellerName = "غير موجود",
            sellerId = "00000000000000000000";
          if (sellerDoc.exists()) {
            sellerName = sellerDoc.data().name;
            sellerId = sellerDoc.id;
          }

          const materialDoc = await getDoc(material);
          var materialName = "غير موجود",
            materialId = "00000000000000000000";
          if (materialDoc.exists()) {
            materialName = materialDoc.data().name;
            materialId = materialDoc.id;
          }

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
            sellerName,
            materialName,
            materialId,
            sellerId,
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

const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPurchases.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getPurchases.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectPurchasesEntities = (state) => state.purchases.entities;

export const selectPurchasesLoading = (state) => state.purchases.loading;

export default purchasesSlice.reducer;
