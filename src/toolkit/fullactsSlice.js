import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
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
          let { act, veg, date, ...rest } = item.data();

          // Fetch the inner collection
          const innerCollectionRef = collection(item.ref, "fullactWorkers");
          const innerQuerySnapshot = await getDocs(innerCollectionRef);
          const innerData = innerQuerySnapshot.docs.map(
            (doc) => doc.data().hoursNum
          );

          // ## Update worker's info by adding the price
          // # Add hour price to each fullact's workers data
          if (item.data().hourPrice) {
            const price = item.data().hourPrice;
            const innerDataIDs = innerQuerySnapshot.docs.map((doc) => doc.id);
            innerDataIDs.forEach((docID) => {
              const docToUpdate = doc(
                database,
                `users/${userId}/fullacts/${item.id}/fullactWorkers`,
                docID
              );
              updateDoc(docToUpdate, {
                hourPrice: price,
              }).catch((err) => console.log("Error", err));
            });
          }
          // # Remove hour price from fullact' data
          const checkOnHourPrice = innerQuerySnapshot.docs.map(
            (doc) => doc.data().hourPrice
          );
          const allExist = () => {
            let check = true;
            checkOnHourPrice.forEach(
              (el) => el == undefined && (check = false)
            );
            return check;
          };
          if (allExist()) {
            const docToUpdate = doc(
              database,
              `users/${userId}/fullacts`,
              item.id
            );
            updateDoc(docToUpdate, {
              hourPrice: deleteField(),
            }).catch((err) => console.log("Error", err));
          }

          // Fetch the act document and veg document using the reference
          if (typeof act !== "string") act = "غير موجود";

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
            act,
            innerData, // Include fetched inner collection data in the result
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
        state.loading = "idle";
        state.entities = action.payload;
      });
  },
});

export const selectFullactEntities = (state) => state.fullacts.entities;
export const selectFullactLoading = (state) => state.fullacts.loading;

export default fullactsSlice.reducer;
