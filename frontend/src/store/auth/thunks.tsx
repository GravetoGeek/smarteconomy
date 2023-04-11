import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "./initialState";

export const loginAsync = createAsyncThunk<User, { username: string; password: string }>(
  "auth/loginAsync",
  async ({ username, password }) => {
    // Simula o login com um usuário hardcoded
    return { username: "john", email: "john@example.com" };
  }
);
