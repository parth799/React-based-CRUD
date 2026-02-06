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
        validator = validator.email('Please enter a valid email address');
        break;
      case 'phone':
        validator = validator.matches(
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
          'Please enter a valid phone number'
        );
        break;
      case 'string':
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
