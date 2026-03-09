import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId, taskTitle } = await request.json();

  if (!taskId || !taskTitle) {
    return NextResponse.json(
      { error: "taskId and taskTitle are required" },
      { status: 400 },
    );
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a compassionate assistant helping people with ADHD start tasks they are struggling with. 
Your job is to break down any task into 4-6 micro-steps that are so small and concrete they feel impossible to say no to.
Each step should take less than 2 minutes and require almost no decision-making.
Never say "research" or "plan" — instead say exactly what to physically do.
Return ONLY a JSON array of strings. No explanation, no preamble. Example: ["Open your laptop", "Go to google.com", "Type the thing you need to find"]`,
      },
      {
        role: "user",
        content: `Break down this task into micro-steps: ${taskTitle}`,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    return NextResponse.json({ error: "No response from AI" }, { status: 500 });
  }

  let steps: string[];
  try {
    steps = JSON.parse(content);
  } catch {
    return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
  }

  // Save steps to database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Delete existing steps for this task first
  await prisma.step.deleteMany({
    where: { taskId },
  });

  // Create new steps
  const savedSteps = await prisma.step.createMany({
    data: steps.map((content, index) => ({
      content,
      order: index,
      taskId,
    })),
  });

  return NextResponse.json({ steps });
}
