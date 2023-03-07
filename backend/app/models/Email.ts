type Email = {
    id?: number;
    subject: string;
    text: string;
    to: string;
    from?: string;
    html?: string;
    created_at?: Date;
    updated_at?: Date;
}

export default Email