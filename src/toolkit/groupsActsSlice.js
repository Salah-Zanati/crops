import { collection, getDoc, getDocs } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { convertDate } from "../utils/functions";

const initialState = { entities: [], loading: "idle" };

export const getGroupsActs = createAsyncThunk(
  "groupsActs/getGroupsActs",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/groupsActs`);

      const querySnapshot = await getDocs(collectionRef);
      const data = await Promise.all(
        querySnapshot.docs.map(async (item) => {
          let { act, veg, group, currency, date, ...rest } = item.data();
          // Fetch the act document and veg document using the reference
          if (typeof act !== "string") act = "غير موجود";

          const vegDoc = await getDoc(veg);
          var vegName = "غير موجود",
            vegId = "00000000000000000000";
          if (vegDoc.exists()) {
            vegName = vegDoc.data().name;
            vegId = vegDoc.id;
          }

          const groupDoc = await getDoc(group);
          var groupName = "غير موجود",
            groupId = "00000000000000000000";
          if (groupDoc.exists()) {
            groupName = groupDoc.data().name;
            groupId = groupDoc.id;
          }

          const currencyDoc = await getDoc(currency);
          var currencyName = "غير موجود",
            currencyId = "00000000000000000000";
          if (currencyDoc.exists()) {
            currencyName = currencyDoc.data().name;
            currencyId = currencyDoc.id;
          }

          const theDate = convertDate(date.toMillis());

          return {
            ...rest,
            id: item.id,
            date: theDate,
            act,
            vegName,
            vegId,
            groupName,
            groupId,
            currencyName,
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

const groupsActsSlice = createSlice({
  name: "groupsActs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGroupsActs.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getGroupsActs.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectGroupsActEntities = (state) => state.groupsActs.entities;
export const selectGroupsActLoading = (state) => state.groupsActs.loading;

export default groupsActsSlice.reducer;
