'use client';

import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextField, Box, Button, CircularProgress } from '@mui/material';
import { formFields, generateValidationSchema, generateInitialValues } from '@/config/formConfig';
import { User, UserFormValues } from '@/types/user';

interface UserFormProps {
  initialValues?: Partial<User>;
  onSubmit: (values: UserFormValues) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialValues, onSubmit, onCancel, isEdit = false }) => {
  const validationSchema = generateValidationSchema(formFields);
  const defaultValues = generateInitialValues(formFields);

  const mergedValues: UserFormValues = {
    ...defaultValues,
    ...(initialValues ? {
      firstName: initialValues.firstName || '',
      lastName: initialValues.lastName || '',
      phone: initialValues.phone || '',
      email: initialValues.email || ''
    } : {})
  };

  const handleSubmit = async (
    values: UserFormValues,
    { setSubmitting }: FormikHelpers<UserFormValues>
  ) => {
    await onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={mergedValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
            {formFields.map((field) => (
              <TextField
                key={field.name}
                fullWidth
                id={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                value={values[field.name] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
                placeholder={field.placeholder}
                required={field.required}
                variant="outlined"
              />
            ))}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
