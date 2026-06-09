"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserList = void 0;
const react_1 = __importDefault(require("react"));
const UserCard_1 = require("./UserCard");
const useFetch_1 = require("./useFetch");
const UserList = ({ apiUrl }) => {
    const { data: users, loading, error } = (0, useFetch_1.useFetch)(apiUrl);
    const handleUserUpdate = (updatedUser) => {
        console.log('User updated:', updatedUser);
        // In real app: call API to save
    };
    if (loading)
        return <div>Loading...</div>;
    if (error)
        return <div>Error: {error.message}</div>;
    if (!users)
        return <div>No users found</div>;
    return (<div className="user-list">
      <h2>Users ({users.length})</h2>
      {users.map(user => (<UserCard_1.UserCard key={user.id} {...user} onUpdate={handleUserUpdate}/>))}
    </div>);
};
exports.UserList = UserList;
//# sourceMappingURL=UserList.js.map