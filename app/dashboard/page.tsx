"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [breakingDown, setBreakingDown] = useState<string | null>(null);

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
    const data = await res.json();
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

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Flowly</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session?.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Hey {session?.user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-gray-500 mb-8">
          What do you need to get done today?
        </p>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task..."
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <button
            onClick={addTask}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Add
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No tasks yet. Add one above.
          </p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white px-5 py-4 rounded-xl border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-medium">
                    {task.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => breakDown(task)}
                      disabled={breakingDown === task.id}
                      className="text-sm text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50"
                    >
                      {breakingDown === task.id
                        ? "Breaking down..."
                        : "✨ Break it down"}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {task.steps && task.steps.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {task.steps
                      .sort((a, b) => a.order - b.order)
                      .map((step, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-medium">
                            {i + 1}
                          </span>
                          {step.content}
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
