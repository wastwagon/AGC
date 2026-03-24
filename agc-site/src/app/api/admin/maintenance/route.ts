import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-api";
import { runMaintenanceTask } from "@/lib/admin-maintenance";

type TaskName = "migrate" | "seed";

function isTaskName(value: unknown): value is TaskName {
  return value === "migrate" || value === "seed";
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = (await request.json()) as { task?: unknown };
    if (!isTaskName(body.task)) {
      return NextResponse.json({ error: "Invalid task. Use 'migrate' or 'seed'." }, { status: 400 });
    }

    const result = await runMaintenanceTask(body.task);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (err) {
    console.error("Admin maintenance API error:", err);
    return NextResponse.json({ error: "Failed to execute maintenance task." }, { status: 500 });
  }
}
