'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { User } from '@/types/user';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  loading?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  user,
  loading = false
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
              backgroundColor: '#fef2f2',
              color: '#ef4444'
            }}
          >
            <WarningAmberIcon />
          </Box>
          <Typography variant="h6">Delete User</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to delete{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {user?.firstName} {user?.lastName}
          </Box>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
