type Profile = {
    id?: number;
    name?: string | null;
    lastname?: string | null;
    birthday?: Date | null;
    monthly_income?: number | null;
    profession?: string | null;
    gender_id?: number | null;
    user_id?: number;
    created_at_?: Date | null;
    updated_at_?: Date | null;
};

export default Profile
