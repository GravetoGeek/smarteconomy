type Transaction = {
    id?: number;
    amount?: number;
    destination_account?: number | null;
    description?: string;
    type: string;
    date?: number;
    account_id?: number;
    category_id?: number;
    created_at?: number;
    updated_at?: number;
};
export default Transaction
