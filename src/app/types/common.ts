export interface StatusOption {
  label: string;
  value: string | null;
}

export interface StatusFormOption {
  label: string;
  value: boolean;
}


export interface EmailSettingSchema {
  id?: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: 'none' | 'tls' | 'ssl';
  from_email: string;
  from_name: string;
  is_enabled: boolean;
  max_send_rate?: number;
  timeout?: number;
}

export interface EmailTemplateSchema {
  id?: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'reset_password' | 'notification' | 'custom';
  is_active: boolean;
}