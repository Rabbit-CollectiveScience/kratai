import React, { useState, useEffect } from 'react';

export interface UserProps {
  id: number;
  name: string;
  email: string;
  onUpdate?: (user: UserProps) => void;
}

export const UserCard: React.FC<UserProps> = ({ id, name, email, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(name);

  useEffect(() => {
    console.log(`UserCard ${id} mounted`);
    return () => console.log(`UserCard ${id} unmounted`);
  }, [id]);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ id, name: localName, email });
    }
    setIsEditing(false);
  };

  return (
    <div className="user-card">
      {isEditing ? (
        <input value={localName} onChange={(e) => setLocalName(e.target.value)} />
      ) : (
        <h3>{name}</h3>
      )}
      <p>{email}</p>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
      {isEditing && <button onClick={handleSave}>Save</button>}
    </div>
  );
};
