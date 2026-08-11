import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

  const { projectId, role, content } = await req.json();

  const message = await prisma.message.create({
    data: { projectId, role, content },
  });

  return NextResponse.json(message);
}
