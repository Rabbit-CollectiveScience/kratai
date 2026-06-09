import React from 'react';
import UserCard from './UserCard';
import useFetch from './useFetch';

function UserList() {
    const { data: users, loading, error } = useFetch('/api/users');

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="user-list">
            <h2>Users</h2>
            <div className="user-grid">
                {users && users.map(user => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

export default UserList;
