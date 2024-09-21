type Transaction = {
    id?: number;
    amount: number;
    destination_account?: number | null;
    description?: string;
    type_id: number;
    date: number | Date | string;
    account_id: number;
    category_id: number;
    created_at?: number;
    updated_at?: number;
};
export default Transaction
