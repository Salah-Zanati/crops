import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { database } from "../firebaseConfig";

const initialState = { entities: [], loading: "idle", access: false, ref: "" };

const collectionRef = collection(database, "usersInfo");

export const getUsers = createAsyncThunk("users/getUsers", async () => {
  try {
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((item) => {
      const { data, ...rest } = item.data();

      return {
        userId: data.id,
        ...rest,
        id: item.id,
      };
    });
    return data;
  } catch (err) {
    throw new Error(err);
  }
});

const loginSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    openAccess(state, action) {
      state.access = true;
      state.ref = action.payload;
    },
    closeAccess(state) {
      state.access = false;
      state.ref = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        (state.loading = "idle"), (state.entities = action.payload);
      });
  },
});

export const selectUsersEntities = (state) => state.users.entities;
export const selectUsersLoading = (state) => state.users.loading;
export const selectAccess = (state) => state.users.access;
export const selectUserId = (state) => state.users.ref;

export const { closeAccess, openAccess } = loginSlice.actions;

export default loginSlice.reducer;
