type Balance = {
    id?: number;
    total_balance: number;
    total_income: number;
    total_expense: number;
    total_transfer_in: number;
    total_transfer_out: number;
    profile_id: number;
    created_at_?: Date;
    updated_at_?: Date;
};

export default Balance
