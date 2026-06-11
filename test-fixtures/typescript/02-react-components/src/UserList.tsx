import React from 'react';
import { UserCard, UserProps } from './UserCard';
import { useFetch } from './useFetch';

export interface UserListProps {
  apiUrl: string;
}

export const UserList: React.FC<UserListProps> = ({ apiUrl }) => {
  const { data: users, loading, error } = useFetch<UserProps[]>(apiUrl);

  const handleUserUpdate = (updatedUser: UserProps) => {
    console.log('User updated:', updatedUser);
    // In real app: call API to save
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!users) return <div>No users found</div>;

  return (
    <div className="user-list">
      <h2>Users ({users.length})</h2>
      {users.map(user => (
        <UserCard key={user.id} {...user} onUpdate={handleUserUpdate} />
      ))}
    </div>
  );
};
