import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userInitialState } from './initialState';

export const userSlice = createSlice({
    name: 'user',
    initialState: userInitialState,
    reducers: {
        setUserId(state, action: PayloadAction<string>) {
            state.userId = action.payload
        },
        setUserEmail(state, action: PayloadAction<string>) {
            state.userEmail = action.payload
        },
    },
    extraReducers: (builder) => {
        // ...
    },
});

export const { setUserId, setUserEmail } = userSlice.actions;