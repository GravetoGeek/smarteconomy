type Transaction = {
    id?: number;
    amount?: number;
    destination_account?: string;
    description?: string;
    type: string;
    date?: Date;
    account_id?: number;
    category_id?: number;
}
export default Transaction