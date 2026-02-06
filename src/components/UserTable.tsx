'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User, UserFormValues } from '@/types/user';
import { formFields } from '@/config/formConfig';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  if (users.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 4,
          backgroundColor: '#f8fafc',
          borderRadius: 3,
          border: '2px dashed #e2e8f0'
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No users found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click the &quot;Add User&quot; button to create your first user
        </Typography>
      </Box>
    );
  }

  const getCellValue = (user: User, fieldName: keyof UserFormValues): string => {
    return user[fieldName] || '';
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {formFields.map((field) => (
              <TableCell key={field.name} sx={{ fontWeight: 600 }}>
                {field.label}
              </TableCell>
            ))}
            <TableCell align="center" sx={{ fontWeight: 600, width: 120 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              sx={{
                '&:hover': { backgroundColor: '#f8fafc' },
                transition: 'background-color 0.2s'
              }}
            >
              {formFields.map((field) => (
                <TableCell key={field.name}>
                  {field.name === 'email' ? (
                    <Chip
                      label={getCellValue(user, field.name)}
                      size="small"
                      sx={{
                        backgroundColor: '#e0e7ff',
                        color: '#4338ca',
                        fontWeight: 500
                      }}
                    />
                  ) : (
                    <Typography variant="body2">{getCellValue(user, field.name)}</Typography>
                  )}
                </TableCell>
              ))}
              <TableCell align="center">
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(user)}
                    sx={{
                      color: '#6366f1',
                      '&:hover': { backgroundColor: '#eef2ff' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(user)}
                    sx={{
                      color: '#ef4444',
                      '&:hover': { backgroundColor: '#fef2f2' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
