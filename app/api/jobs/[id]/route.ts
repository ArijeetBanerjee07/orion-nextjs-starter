import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id }
    });

    if (!job) {
      return new NextResponse('Job not found', { status: 404 });
    }

    return NextResponse.json(job);
  } catch (err) {
    return new NextResponse('Error fetching job', { status: 500 });
  }
}
