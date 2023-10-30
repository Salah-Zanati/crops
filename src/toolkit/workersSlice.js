import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";

const initialState = { entities: [], loading: "idle" };

// export const addDocumentToInnerCollection = createAsyncThunk(
//   "workers/addDocumentToInnerCollection",
//   async (documentData) => {
//     try {
//       const userId = useSelector(selectUserId);
//       const userDocRef = doc(database, "users", userId);
//       const innerCollectionRef = collection(userDocRef, "innerCollection");

// await setDoc(doc(innerCollectionRef), documentData);
//     } catch (err) {
//       throw new Error(err);
//     }
//   }
// );

// export const updateDocumentInInnerCollection = createAsyncThunk(
//   "workers/updateDocumentInInnerCollection",
//   async ({ documentId, documentData }) => {
//     try {
//       const userId = useSelector(selectUserId);
//       const userDocRef = doc(database, "users", userId);
//       const innerCollectionRef = collection(userDocRef, "innerCollection");

//       await updateDoc(doc(innerCollectionRef, documentId), documentData);
//     } catch (err) {
//       throw new Error(err);
//     }
//   }
// );

// export const deleteDocumentFromInnerCollection = createAsyncThunk(
//   "workers/deleteDocumentFromInnerCollection",
//   async (documentId) => {
//     try {
//       const userId = useSelector(selectUserId);
//       const userDocRef = doc(database, "users", userId);
//       const innerCollectionRef = collection(userDocRef, "innerCollection");

// await deleteDoc(doc(innerCollectionRef, documentId));
//     } catch (err) {
//       throw new Error(err);
//     }
//   }
// );

export const getWorkers = createAsyncThunk(
  "workers/getWorkers",
  async (_, { getState }) => {
    try {
      const userId = getState().users.ref;
      const collectionRef = collection(database, `users/${userId}/workers`);

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

const workersSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWorkers.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getWorkers.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectWorkersEntities = (state) => state.workers.entities;
export const selectWorkersLoading = (state) => state.workers.loading;

export default workersSlice.reducer;
