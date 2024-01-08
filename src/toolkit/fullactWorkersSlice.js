import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { getDoc } from "firebase/firestore";

const initialState = { entities: [], loading: "idle" };

export const getFullactWorkers = createAsyncThunk(
  "fullactWorkers/getFullactWorkers",
  async (fullactId, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(
        database,
        `users/${userId}/fullacts/${fullactId}/fullactWorkers`
      );

      const querySnapshot = await getDocs(collectionRef);
      const data = await Promise.all(
        querySnapshot.docs.map(async (item) => {
          const { worker, ...rest } = item.data();
          const workerDoc = await getDoc(worker);
          const workerName = workerDoc.data().name;
          const workerId = workerDoc.id;

          return {
            ...rest,
            id: item.id,
            workerName,
            workerId,
          };
        })
      );
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }
);

const fullactWorkersSlice = createSlice({
  name: "fullactWorkers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFullactWorkers.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getFullactWorkers.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectFullactWorkersEntities = (state) =>
  state.fullactWorkers.entities;

export const selectFullactWorkersLoading = (state) =>
  state.fullactWorkers.loading;

export default fullactWorkersSlice.reducer;
