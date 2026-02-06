'use client';

import { useState, useCallback, useEffect } from 'react';
import { User, UserFormValues } from '@/types/user';
import {
  getUsers as getStorageUsers,
  createUser as createStorageUser,
  updateUser as updateStorageUser,
  deleteUser as deleteStorageUser
} from '@/utils/storage';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: UserFormValues) => Promise<User | null>;
  updateUser: (id: string, userData: UserFormValues) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const storedUsers = getStorageUsers();
      setUsers(storedUsers);
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: UserFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = createStorageUser(userData);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch {
      setError('Failed to create user');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: UserFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = updateStorageUser(id, userData);
      if (updatedUser) {
        setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
        return updatedUser;
      } else {
        setError('User not found');
        return null;
      }
    } catch {
      setError('Failed to update user');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const deleted = deleteStorageUser(id);
      if (deleted) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        return true;
      } else {
        setError('User not found');
        return false;
      }
    } catch {
      setError('Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};
