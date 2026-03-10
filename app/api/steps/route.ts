import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return NextResponse.json({ error: "taskId is required" }, { status: 400 });
  }

  // Verify the task belongs to the logged in user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: user.id },
  });

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const steps = await prisma.step.findMany({
    where: { taskId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ steps });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { stepId, done } = await request.json();

  if (!stepId) {
    return NextResponse.json({ error: "stepId is required" }, { status: 400 });
  }

  // Verify the step belongs to the logged in user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const step = await prisma.step.findFirst({
    where: {
      id: stepId,
      task: { userId: user.id },
    },
  });

  if (!step) {
    return NextResponse.json({ error: "Step not found" }, { status: 404 });
  }

  const updated = await prisma.step.update({
    where: { id: stepId },
    data: { done },
  });

  return NextResponse.json({ step: updated });
}
