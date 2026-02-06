'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import UserForm from './UserForm';
import { User, UserFormValues } from '@/types/user';

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => Promise<void>;
  user?: User | null;
}

const UserDialog: React.FC<UserDialogProps> = ({ open, onClose, onSubmit, user }) => {
  const isEdit = Boolean(user);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: isEdit ? '#fef3c7' : '#e0e7ff',
              color: isEdit ? '#d97706' : '#4f46e5'
            }}
          >
            {isEdit ? <EditIcon /> : <PersonAddIcon />}
          </Box>
          <Box>
            <Typography variant="h6" component="span">
              {isEdit ? 'Edit User' : 'Add New User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEdit ? 'Update the user information below' : 'Fill in the details to create a new user'}
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: 'text.secondary'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <UserForm
          initialValues={user || undefined}
          onSubmit={onSubmit}
          onCancel={onClose}
          isEdit={isEdit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
