import React from 'react';

function UserCard({ user }) {
    const { name, email, avatar } = user;

    return (
        <div className="user-card">
            <img src={avatar} alt={name} className="user-avatar" />
            <div className="user-info">
                <h3>{name}</h3>
                <p>{email}</p>
            </div>
        </div>
    );
}

export default UserCard;
