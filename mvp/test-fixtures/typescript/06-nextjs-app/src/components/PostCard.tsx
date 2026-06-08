import React from 'react';
import { Post } from '@/lib/PostRepository';

interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  return (
    <div className="post-card">
      <h2>{post.title}</h2>
      <p className="author">By {post.author}</p>
      <p>{post.content}</p>
      <time>{post.createdAt.toLocaleDateString()}</time>
      {onDelete && (
        <button onClick={() => onDelete(post.id)}>Delete</button>
      )}
    </div>
  );
}
