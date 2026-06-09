"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const PostRepository_1 = require("@/lib/PostRepository");
const repository = new PostRepository_1.PostRepository();
async function GET(request) {
    const posts = repository.findAll();
    return server_1.NextResponse.json(posts);
}
async function POST(request) {
    const body = await request.json();
    const { title, content, author } = body;
    const post = repository.create(title, content, author);
    return server_1.NextResponse.json(post, { status: 201 });
}
//# sourceMappingURL=route.js.map