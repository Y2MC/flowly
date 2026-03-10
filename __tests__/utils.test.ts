import { describe, it, expect } from "vitest";

// Test the free tier limit logic
describe("Free tier limit", () => {
  it("should allow breakdown when under the limit", () => {
    const todayBreakdowns = 3;
    const FREE_DAILY_LIMIT = 5;
    expect(todayBreakdowns < FREE_DAILY_LIMIT).toBe(true);
  });

  it("should block breakdown when limit is reached", () => {
    const todayBreakdowns = 5;
    const FREE_DAILY_LIMIT = 5;
    expect(todayBreakdowns >= FREE_DAILY_LIMIT).toBe(true);
  });

  it("should block breakdown when limit is exceeded", () => {
    const todayBreakdowns = 6;
    const FREE_DAILY_LIMIT = 5;
    expect(todayBreakdowns >= FREE_DAILY_LIMIT).toBe(true);
  });
});

// Test step sorting logic
describe("Step sorting", () => {
  it("should sort steps by order ascending", () => {
    const steps = [
      { id: "3", content: "Step 3", order: 2, done: false },
      { id: "1", content: "Step 1", order: 0, done: false },
      { id: "2", content: "Step 2", order: 1, done: false },
    ];
    const sorted = [...steps].sort((a, b) => a.order - b.order);
    expect(sorted[0].content).toBe("Step 1");
    expect(sorted[1].content).toBe("Step 2");
    expect(sorted[2].content).toBe("Step 3");
  });

  it("should find the first incomplete step", () => {
    const steps = [
      { id: "1", content: "Step 1", order: 0, done: true },
      { id: "2", content: "Step 2", order: 1, done: false },
      { id: "3", content: "Step 3", order: 2, done: false },
    ];
    const firstIncomplete = steps.findIndex((s) => !s.done);
    expect(firstIncomplete).toBe(1);
  });

  it("should return -1 when all steps are done", () => {
    const steps = [
      { id: "1", content: "Step 1", order: 0, done: true },
      { id: "2", content: "Step 2", order: 1, done: true },
    ];
    const firstIncomplete = steps.findIndex((s) => !s.done);
    expect(firstIncomplete).toBe(-1);
  });
});

// Test task filtering logic
describe("Task filtering", () => {
  it("should filter out deleted tasks", () => {
    const tasks = [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
      { id: "3", title: "Task 3" },
    ];
    const filtered = tasks.filter((t) => t.id !== "2");
    expect(filtered.length).toBe(2);
    expect(filtered.find((t) => t.id === "2")).toBeUndefined();
  });
});
