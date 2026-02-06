import { FormField, UserFormValues } from '@/types/user';
import * as Yup from 'yup';

export const formFields: FormField[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    validation: 'string',
    placeholder: 'Enter first name',
    minLength: 2,
    maxLength: 50
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    validation: 'string',
    placeholder: 'Enter last name',
    minLength: 2,
    maxLength: 50
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    required: true,
    validation: 'phone',
    placeholder: 'Enter phone number'
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    validation: 'email',
    placeholder: 'Enter email address'
  }
];

export const generateValidationSchema = (fields: FormField[]) => {
  const shape: Record<string, Yup.StringSchema> = {};

  fields.forEach((field) => {
    let validator = Yup.string();

    if (field.required) {
      validator = validator.required(`${field.label} is required`);
    }

    switch (field.validation) {
      case 'email':
        validator = validator
          .email('Please enter a valid email address')
          .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email address (e.g., user@example.com)'
          )
          .max(254, 'Email address is too long');
        break;
      case 'phone':
        validator = validator
          .matches(
            /^(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}$/,
            'Please enter a valid phone number (e.g., +1 234-567-8901 or 1234567890)'
          )
          .test(
            'min-digits',
            'Phone number must contain at least 10 digits',
            (value) => {
              if (!value) return true;
              const digitsOnly = value.replace(/\D/g, '');
              return digitsOnly.length >= 10;
            }
          )
          .test(
            'max-digits',
            'Phone number must not exceed 15 digits',
            (value) => {
              if (!value) return true;
              const digitsOnly = value.replace(/\D/g, '');
              return digitsOnly.length <= 15;
            }
          );
        break;
      case 'string':
        if (field.name === 'firstName' || field.name === 'lastName') {
          validator = validator.matches(
            /^[a-zA-Z\s'-]+$/,
            `${field.label} can only contain letters, spaces, hyphens, and apostrophes`
          );
        }
        if (field.minLength) {
          validator = validator.min(
            field.minLength,
            `${field.label} must be at least ${field.minLength} characters`
          );
        }
        if (field.maxLength) {
          validator = validator.max(
            field.maxLength,
            `${field.label} must be at most ${field.maxLength} characters`
          );
        }
        break;
    }

    shape[field.name] = validator;
  });

  return Yup.object().shape(shape);
};

export const generateInitialValues = (fields: FormField[]): UserFormValues => {
  const values: Record<string, string> = {};
  fields.forEach((field) => {
    values[field.name] = '';
  });
  return values as UserFormValues;
};

export const tableColumns = formFields.map((field) => ({
  field: field.name,
  headerName: field.label,
  flex: 1,
  minWidth: 150
}));
