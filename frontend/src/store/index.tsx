import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { authSlice } from "./auth/slice";
import transactionsReducer from "./transactionsSlice";
import { userSlice } from "./user/slice";


export default store = configureStore({
    reducer: {
        user: userSlice.reducer,
        auth: authSlice.reducer,
        transactions: transactionsReducer,

    },
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();