export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type UserFormValues = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type FieldType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea';

export type ValidationType = 'string' | 'email' | 'phone' | 'date' | 'number';

export interface FormField {
  name: keyof UserFormValues;
  label: string;
  type: FieldType;
  required: boolean;
  validation: ValidationType;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
