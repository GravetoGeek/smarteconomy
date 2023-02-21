type Email = {
    id?: number;
    subject: string;
    text: string;
    to: string;
    from?: string;
    html?: string;
}

export default Email