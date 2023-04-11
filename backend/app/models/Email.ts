type Email = {
  id?: number;
  subject: string;
  text: string;
  to: string;
  from?: string;
  html?: string;
  created_at?: number;
  updated_at?: number;
};

export default Email
