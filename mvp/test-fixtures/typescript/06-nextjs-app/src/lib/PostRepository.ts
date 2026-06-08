export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

export class PostRepository {
  private posts: Post[] = [];

  findAll(): Post[] {
    return this.posts;
  }

  findById(id: number): Post | undefined {
    return this.posts.find(post => post.id === id);
  }

  create(title: string, content: string, author: string): Post {
    const post: Post = {
      id: this.posts.length + 1,
      title,
      content,
      author,
      createdAt: new Date()
    };
    this.posts.push(post);
    return post;
  }
}
