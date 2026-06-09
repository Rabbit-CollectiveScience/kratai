"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCard = void 0;
const react_1 = __importStar(require("react"));
const UserCard = ({ id, name, email, onUpdate }) => {
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [localName, setLocalName] = (0, react_1.useState)(name);
    (0, react_1.useEffect)(() => {
        console.log(`UserCard ${id} mounted`);
        return () => console.log(`UserCard ${id} unmounted`);
    }, [id]);
    const handleSave = () => {
        if (onUpdate) {
            onUpdate({ id, name: localName, email });
        }
        setIsEditing(false);
    };
    return (<div className="user-card">
      {isEditing ? (<input value={localName} onChange={(e) => setLocalName(e.target.value)}/>) : (<h3>{name}</h3>)}
      <p>{email}</p>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
      {isEditing && <button onClick={handleSave}>Save</button>}
    </div>);
};
exports.UserCard = UserCard;
//# sourceMappingURL=UserCard.js.map