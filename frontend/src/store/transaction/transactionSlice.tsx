import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";

type Transaction = {
    id?: number;
    amount?: number;
    destination_account?: string;
    description?: string;
    type: string;
    date?: Date;
    account_id?: number;
    category_id?: number;
    created_at_?: Date;
    updated_at_?: Date;
};

const initialState: Transaction[] = [];

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        addTransaction: (state, action: PayloadAction<Transaction>) => {
            state.push(action.payload);
        },
        removeTransaction: (state, action: PayloadAction<number>) => {
            return state.filter((transaction) => transaction.id !== action.payload);
        },
    },
});

export const { addTransaction, removeTransaction } = transactionsSlice.actions;

export const selectTransactions = (state: RootState) => state.transactions;

export default transactionsSlice.reducer;
