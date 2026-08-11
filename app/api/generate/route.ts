import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

  const { prompt, sessionId, currentCode } = await req.json();

  let codeContext = "";
  if (currentCode) {
    codeContext = `\n\nCURRENT CODE TO MODIFY:\n\`\`\`html\n${currentCode}\n\`\`\`\n\nINSTRUCTION: The user wants to modify the CURRENT CODE above. Please return the FULL updated HTML code, applying the user's requested changes.`;
  }

  const augmentedPrompt = `${prompt}${codeContext}\n\nIMPORTANT: You MUST include the full generated code inside a standard \`\`\`tsx markdown block in your final response. The user's frontend needs this code block to display it in the preview window!`;

  // Create a Job in the database
  const job = await prisma.job.create({
    data: {
      projectId: sessionId,
      status: 'PROCESSING'
    }
  });

  // Use production webhook URL (or tell user to activate it)
  const n8nUrl = 'https://arijeetban.app.n8n.cloud/webhook/generate';
  try {
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: augmentedPrompt, sessionId, jobId: job.id })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n Webhook Error:', errorText);
      await prisma.job.update({ where: { id: job.id }, data: { status: 'ERROR' } });
      return new NextResponse('Failed to fetch from n8n: ' + errorText, { status: 500 });
    }
    
    // Return immediately with the jobId so the frontend can start polling
    return NextResponse.json({ jobId: job.id });
  } catch (err) {
    return new NextResponse('Error connecting to webhook', { status: 500 });
  }
}
