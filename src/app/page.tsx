'use client';

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import UserTable from '@/components/UserTable';
import UserDialog from '@/components/UserDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useUsers } from '@/hooks/useUsers';
import { User, UserFormValues } from '@/types/user';

export default function Home() {
  const { users, loading, error, createUser, updateUser, deleteUser, fetchUsers } = useUsers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpenDialog = (user?: User) => {
    setSelectedUser(user || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (values: UserFormValues) => {
    if (selectedUser) {
      const result = await updateUser(selectedUser.id, values);
      if (result) {
        setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
        handleCloseDialog();
      } else {
        setSnackbar({ open: true, message: 'Failed to update user', severity: 'error' });
      }
    } else {
      const result = await createUser(values);
      if (result) {
        setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' });
        handleCloseDialog();
      } else {
        setSnackbar({ open: true, message: 'Failed to create user', severity: 'error' });
      }
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      const result = await deleteUser(selectedUser.id);
      if (result) {
        setSnackbar({ open: true, message: 'User deleted successfully!', severity: 'success' });
        handleCloseDeleteDialog();
      } else {
        setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white'
                }}
              >
                <PeopleIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  User Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your users with ease
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchUsers}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                  }
                }}
              >
                Add User
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {loading && users.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <UserTable users={users} onEdit={handleOpenDialog} onDelete={handleOpenDeleteDialog} />
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Users: {users.length}
            </Typography>
          </Box>
        </Paper>
      </Container>

      <UserDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        user={selectedUser}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        user={selectedUser}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
