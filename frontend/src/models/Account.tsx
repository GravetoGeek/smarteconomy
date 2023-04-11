type Account = {
    id?: number;
    name: string;
    destination_account_id?: number;
    description: string;
    type: string;
    profile_id: number;
    created_at_?: Date;
    updated_at_?: Date;
};

export default Account
