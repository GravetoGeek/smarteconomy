type Transaction = {
    id?: number;
    amount?: number;
    destination_account?: number | null;
    description?: string;
    type: string;
    date?: number;
    account_id?: number;
    category_id?: number;
    created_at_?: Date;
    updated_at_?: Date;
};
export default Transaction
