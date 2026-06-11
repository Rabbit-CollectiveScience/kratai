"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCard = PostCard;
const react_1 = __importDefault(require("react"));
function PostCard({ post, onDelete }) {
    return (<div className="post-card">
      <h2>{post.title}</h2>
      <p className="author">By {post.author}</p>
      <p>{post.content}</p>
      <time>{post.createdAt.toLocaleDateString()}</time>
      {onDelete && (<button onClick={() => onDelete(post.id)}>Delete</button>)}
    </div>);
}
//# sourceMappingURL=PostCard.js.map