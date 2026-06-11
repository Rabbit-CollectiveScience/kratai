"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
class PostRepository {
    posts = [];
    findAll() {
        return this.posts;
    }
    findById(id) {
        return this.posts.find(post => post.id === id);
    }
    create(title, content, author) {
        const post = {
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
exports.PostRepository = PostRepository;
//# sourceMappingURL=PostRepository.js.map