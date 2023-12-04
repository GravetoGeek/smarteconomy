import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "./interfaces/IUser";
import { setUserDetails } from './utils';


export const setUser = createAsyncThunk('user/setUser', async (data: IUser): Promise<IUser> => {
    setUserDetails(data);
    return data;
});

export const fetchUserDetails = createAsyncThunk('user/fetchUserDetails', async (userId: string) => {
    const response = await fetch(`http://localhost:8000/user/${userId}`);
    const userDetails = await response.json();
    return userDetails;
});

