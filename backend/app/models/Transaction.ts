type Transaction = {
    id?: number;
    amount?: number;
    destination_account?: string;
    description?: string;
    type: string;
    date?: Date;
    account_id?: number;
    category_id?: number;
    created_at?: Date;
    updated_at?: Date;
}
export default Transaction