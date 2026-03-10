"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Step {
  id: string;
  content: string;
  order: number;
  done: boolean;
}

function FocusContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const taskTitle = searchParams.get("title");

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!taskId || status !== "authenticated") return;

    fetch(`/api/steps?taskId=${taskId}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.steps || []).sort(
          (a: Step, b: Step) => a.order - b.order,
        );
        setSteps(sorted);
        // Find first incomplete step
        const firstIncomplete = sorted.findIndex((s: Step) => !s.done);
        setCurrentIndex(firstIncomplete === -1 ? 0 : firstIncomplete);
        setLoading(false);
      });
  }, [taskId, status]);

  async function markDone(stepId: string) {
    await fetch("/api/steps", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stepId, done: true }),
    });

    const updated = steps.map((s) =>
      s.id === stepId ? { ...s, done: true } : s,
    );
    setSteps(updated);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= steps.length) {
      setAllDone(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  if (loading || status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <p
          className="text-[#E8E3D9]/30 text-sm tracking-widest uppercase"
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          Loading...
        </p>
      </main>
    );
  }

  if (steps.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <p
            className="text-[#E8E3D9]/30 text-sm mb-6"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            No steps yet for this task.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs tracking-widest uppercase text-[#E8E3D9]/40 hover:text-[#E8E3D9] transition-colors"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            ← Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  if (allDone) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <div className="text-center max-w-sm px-8">
          <p className="text-5xl mb-8">✓</p>
          <h2
            className="text-2xl font-normal text-[#E8E3D9] mb-4 tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Task complete.
          </h2>
          <p
            className="text-sm text-[#E8E3D9]/30 mb-10"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            You did the thing.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs tracking-widest uppercase text-[#E8E3D9]/40 hover:text-[#E8E3D9] transition-colors"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            ← Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  const currentStep = steps[currentIndex];
  const progress = steps.filter((s) => s.done).length;
  const total = steps.length;

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-[#E8E3D9] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs tracking-widest uppercase text-[#E8E3D9]/25 hover:text-[#E8E3D9] transition-colors"
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          ← Back
        </button>
        <span
          className="text-xs tracking-widest uppercase text-[#E8E3D9]/25"
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          {progress} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-[#E8E3D9]/8 mx-8">
        <div
          className="h-px bg-[#A8E6A3] transition-all duration-500"
          style={{ width: `${(progress / total) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 max-w-xl mx-auto w-full">
        <p
          className="text-xs tracking-[0.3em] uppercase text-[#E8E3D9]/20 mb-6 text-center"
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          {taskTitle}
        </p>

        <p
          className="text-[10px] tracking-widest uppercase text-[#E8E3D9]/15 mb-12 text-center"
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          Step {currentIndex + 1} of {total}
        </p>

        <h2
          className="text-3xl font-normal text-center leading-snug tracking-tight mb-16"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {currentStep.content}
        </h2>

        <button
          onClick={() => markDone(currentStep.id)}
          className="px-10 py-4 bg-[#E8E3D9] text-[#0D0D0D] text-xs tracking-widest uppercase font-medium hover:bg-[#E8E3D9]/90 transition-colors duration-200"
          style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
        >
          Done — next step
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-2 mt-14">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: step.done
                  ? "#A8E6A3"
                  : i === currentIndex
                    ? "#E8E3D9"
                    : "#E8E3D9",
                opacity: step.done ? 1 : i === currentIndex ? 1 : 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function FocusPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
          <p
            className="text-[#E8E3D9]/30 text-sm tracking-widest uppercase"
            style={{ fontFamily: "'Helvetica Neue', sans-serif" }}
          >
            Loading...
          </p>
        </main>
      }
    >
      <FocusContent />
    </Suspense>
  );
}
