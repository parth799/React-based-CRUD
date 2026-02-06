import { User, UserFormValues } from '@/types/user';

const STORAGE_KEY = 'users_data';

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find((user) => user.id === id);
};

export const createUser = (userData: UserFormValues): User => {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const updateUser = (id: string, userData: Partial<UserFormValues>): User | null => {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  saveUsers(users);
  return users[index];
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter((user) => user.id !== id);
  if (filteredUsers.length === users.length) return false;
  saveUsers(filteredUsers);
  return true;
};
