import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, logout } from "./actions";
import { initialState } from "./initialState";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login, (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    });
    builder.addCase(logout, (state) => {
      state.isLoggedIn = false;
      state.user = null;
    });
  },
});

export default authSlice.reducer;
