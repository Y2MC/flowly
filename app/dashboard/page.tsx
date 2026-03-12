"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Step {
  content: string;
  order: number;
}

interface Task {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  steps?: Step[];
}

const serif = "'Georgia', 'Times New Roman', serif";
const sans = "'Helvetica Neue', Arial, sans-serif";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [breakingDown, setBreakingDown] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setTasks(data.tasks || []);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    if (searchParams.get("upgraded") !== "true") return;
    const t = setTimeout(() => {
      setUpgraded(true);
      setIsPro(true);
      setLimitReached(false);
    }, 0);
    return () => clearTimeout(t);
  }, [searchParams]);

  async function addTask() {
    if (!newTask.trim()) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask }),
    });
    const data = await res.json();
    setTasks([{ ...data.task, steps: [] }, ...tasks]);
    setNewTask("");
  }

  async function deleteTask(id: string) {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTasks(tasks.filter((t) => t.id !== id));
  }

  async function breakDown(task: Task) {
    setBreakingDown(task.id);
    const res = await fetch("/api/breakdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: task.id, taskTitle: task.title }),
    });

    if (res.status === 403) {
      const data = await res.json();
      if (data.error === "FREE_LIMIT_REACHED") {
        setLimitReached(true);
      }
      setBreakingDown(null);
      return;
    }

    const data = await res.json();
    if (data.isPro) setIsPro(true);
    setTasks(
      tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              steps: data.steps.map((content: string, order: number) => ({
                content,
                order,
              })),
            }
          : t,
      ),
    );
    setBreakingDown(null);
  }

  async function handleUpgrade() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <p
          style={{ fontFamily: sans }}
          className="text-[#E8E3D9]/30 text-xs tracking-widest uppercase"
        >
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#E8E3D9]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[#E8E3D9]/8">
        <span
          style={{ fontFamily: serif }}
          className="text-base tracking-[0.2em] uppercase text-[#E8E3D9]/80"
        >
          Flowly
        </span>
        <div className="flex items-center gap-6">
          {isPro && (
            <span
              style={{ fontFamily: sans }}
              className="text-[9px] tracking-widest uppercase text-[#A8E6A3] border border-[#A8E6A3]/20 px-2 py-1"
            >
              Pro
            </span>
          )}
          <span
            style={{ fontFamily: sans }}
            className="text-xs text-[#E8E3D9]/30"
          >
            {session?.user?.name}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{ fontFamily: sans }}
            className="text-[10px] tracking-widest uppercase text-[#E8E3D9]/25 hover:text-[#E8E3D9] transition-colors duration-200"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-14">
        {/* Upgraded banner */}
        {upgraded && (
          <div
            style={{ fontFamily: sans }}
            className="mb-8 px-4 py-3 border border-[#A8E6A3]/20 bg-[#A8E6A3]/5 text-[#A8E6A3] text-xs tracking-wide"
          >
            You are now on Flowly Pro — unlimited breakdowns unlocked.
          </div>
        )}

        {/* Limit reached banner */}
        {limitReached && !isPro && (
          <div className="mb-8 px-5 py-5 border border-[#E8E3D9]/10 bg-[#141414]">
            <p
              style={{ fontFamily: serif }}
              className="text-sm text-[#E8E3D9]/70 mb-2"
            >
              You have used your 5 free breakdowns for today.
            </p>
            <p
              style={{ fontFamily: sans }}
              className="text-xs text-[#E8E3D9]/30 mb-5"
            >
              Upgrade to Pro for unlimited AI breakdowns — NZD $8/month.
            </p>
            <button
              onClick={handleUpgrade}
              style={{ fontFamily: sans }}
              className="px-5 py-2.5 bg-[#E8E3D9] text-[#0D0D0D] text-xs tracking-widest uppercase font-medium hover:bg-[#E8E3D9]/90 transition-colors duration-200"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Greeting */}
        <h2
          style={{ fontFamily: serif }}
          className="text-3xl font-normal tracking-tight text-[#E8E3D9] mb-1"
        >
          {session?.user?.name?.split(" ")[0]}
        </h2>
        <p
          style={{ fontFamily: sans }}
          className="text-xs text-[#E8E3D9]/30 tracking-wide mb-10"
        >
          What do you need to get done today?
        </p>

        {/* Input */}
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task..."
            style={{ fontFamily: sans }}
            className="flex-1 px-4 py-3 bg-[#141414] border border-[#E8E3D9]/10 text-[#E8E3D9] text-sm placeholder-[#E8E3D9]/20 focus:outline-none focus:border-[#E8E3D9]/30 transition-colors duration-200"
          />
          <button
            onClick={addTask}
            style={{ fontFamily: sans }}
            className="px-6 py-3 bg-[#E8E3D9] text-[#0D0D0D] text-xs tracking-widest uppercase font-medium hover:bg-[#E8E3D9]/90 transition-colors duration-200"
          >
            Add
          </button>
        </div>

        {/* Task list */}
        {tasks.length === 0 ? (
          <p
            style={{ fontFamily: sans }}
            className="text-center text-[#E8E3D9]/15 text-xs tracking-widest uppercase py-16"
          >
            No tasks yet.
          </p>
        ) : (
          <ul className="space-y-px">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-[#141414] border border-[#E8E3D9]/8 px-5 py-4"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{ fontFamily: serif }}
                    className="text-sm text-[#E8E3D9]/80 font-normal"
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-4">
                    {task.steps && task.steps.length > 0 && (
                      <button
                        onClick={() =>
                          router.push(
                            `/focus?taskId=${task.id}&title=${encodeURIComponent(task.title)}`,
                          )
                        }
                        style={{ fontFamily: sans }}
                        className="text-[10px] tracking-widest uppercase text-[#A8E6A3] hover:text-[#A8E6A3]/60 transition-colors duration-200"
                      >
                        Focus →
                      </button>
                    )}
                    <button
                      onClick={() => breakDown(task)}
                      disabled={breakingDown === task.id}
                      style={{ fontFamily: sans }}
                      className="text-[10px] tracking-widest uppercase text-[#E8E3D9]/35 hover:text-[#E8E3D9] transition-colors duration-200 disabled:opacity-30"
                    >
                      {breakingDown === task.id ? "Thinking..." : "Break down"}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{ fontFamily: sans }}
                      className="text-[10px] tracking-widest uppercase text-[#E8E3D9]/15 hover:text-red-400 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {task.steps && task.steps.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-[#E8E3D9]/5 pt-4">
                    {task.steps
                      .sort((a, b) => a.order - b.order)
                      .map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            style={{ fontFamily: sans }}
                            className="text-[10px] text-[#E8E3D9]/20 mt-0.5 w-4 shrink-0"
                          >
                            {i + 1}
                          </span>
                          <span
                            style={{ fontFamily: sans }}
                            className="text-xs text-[#E8E3D9]/45 leading-relaxed"
                          >
                            {step.content}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
          <p
            style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
            className="text-[#E8E3D9]/30 text-xs tracking-widest uppercase"
          >
            Loading...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
