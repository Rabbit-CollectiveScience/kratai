import { NextRequest, NextResponse } from 'next/server';
import { PostRepository } from '@/lib/PostRepository';

const repository = new PostRepository();

export async function GET(request: NextRequest) {
  const posts = repository.findAll();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, content, author } = body;
  
  const post = repository.create(title, content, author);
  return NextResponse.json(post, { status: 201 });
}
