import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FREE_DAILY_LIMIT = 5;

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

  // Get or create user
  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: {
      email: session.user.email,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    },
  });

  // Check subscription status
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  const isPro = subscription?.status === "active";

  // If free user, check daily usage
  if (!isPro) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayStepCount = await prisma.step.count({
      where: {
        task: { userId: user.id },
        createdAt: { gte: startOfDay },
      },
    });

    // Each breakdown creates ~5 steps, so 5 breakdowns = ~25 steps
    // We track by breakdown attempts instead
    const todayBreakdowns = await prisma.task.count({
      where: {
        userId: user.id,
        steps: {
          some: {
            createdAt: { gte: startOfDay },
          },
        },
      },
    });

    if (todayBreakdowns >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        { error: "FREE_LIMIT_REACHED", limit: FREE_DAILY_LIMIT },
        { status: 403 },
      );
    }
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

  // Delete existing steps for this task
  await prisma.step.deleteMany({
    where: { taskId },
  });

  // Save new steps
  await prisma.step.createMany({
    data: steps.map((content, index) => ({
      content,
      order: index,
      taskId,
    })),
  });

  return NextResponse.json({ steps, isPro });
}
