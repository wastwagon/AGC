"use client";

import { useState } from "react";
import { Loader2, Database, Sprout } from "lucide-react";

type TaskName = "migrate" | "seed";

type MaintenanceResult = {
  ok: boolean;
  task: TaskName;
  command: string;
  summary: string;
  output: string;
};

export function AdminMaintenancePanel() {
  const [runningTask, setRunningTask] = useState<TaskName | null>(null);
  const [result, setResult] = useState<MaintenanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runTask(task: TaskName) {
    setRunningTask(task);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Task failed.");
        if (data?.output) {
          setResult({
            ok: false,
            task,
            command: data.command ?? "(unknown command)",
            summary: data.summary ?? "Task failed.",
            output: data.output,
          });
        }
        return;
      }
      setResult(data as MaintenanceResult);
    } catch {
      setError("Could not reach maintenance endpoint.");
    } finally {
      setRunningTask(null);
    }
  }

  const isRunning = runningTask !== null;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => runTask("migrate")}
          disabled={isRunning}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {runningTask === "migrate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          Run Prisma migrate deploy
        </button>
        <button
          type="button"
          onClick={() => runTask("seed")}
          disabled={isRunning}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {runningTask === "seed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
          Run database seed
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Runs in the web container. Normal deploys already run migrate + seed via the separate migrate job; use this if
        that job failed. If `DATABASE_URL` is missing or is a Prisma dev proxy URL, the runner falls back to Docker
        Postgres on `localhost:5436` when appropriate.
      </p>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      ) : null}

      {result ? (
        <div className={`rounded-xl border p-4 ${result.ok ? "border-emerald-200 bg-emerald-50/60" : "border-amber-200 bg-amber-50/70"}`}>
          <p className={`text-sm font-medium ${result.ok ? "text-emerald-800" : "text-amber-800"}`}>{result.summary}</p>
          <p className="mt-2 text-xs text-slate-600">
            Command: <code className="rounded bg-slate-100 px-1 py-0.5">{result.command}</code>
          </p>
          <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">
            {result.output}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
