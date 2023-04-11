type Email = {
    id?: number;
    subject: string;
    text: string;
    to: string;
    from?: string;
    html?: string;
    created_at_?: Date;
    updated_at_?: Date;
};

export default Email
