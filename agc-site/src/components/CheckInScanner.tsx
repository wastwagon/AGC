"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { playCheckInTone, vibrateCheckIn } from "@/lib/check-in-feedback";

type CheckInResult = {
  valid: boolean;
  alreadyCheckedIn?: boolean;
  registration?: {
    fullName: string;
    organization?: string;
    eventTitle: string;
    registrationId: string;
    eventSlug?: string;
    checkedInAt?: string;
  };
  message?: string;
  error?: string;
};

type CheckInScannerProps = {
  /** When set, rejects badges for other events (from admin “scan for this event”). */
  expectedEventSlug?: string;
  expectedEventTitle?: string;
};

type RecentScan = { at: string; summary: string; outcome: "success" | "duplicate" | "error" };

export function CheckInScanner({ expectedEventSlug, expectedEventTitle }: CheckInScannerProps) {
  const [mode, setMode] = useState<"manual" | "camera">("manual");
  const [manualId, setManualId] = useState("");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const performCheckIn = useCallback(
    async (scanPayload: string) => {
      setLoading(true);
      setResult(null);
      try {
        const res = await fetch("/api/events/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scan: scanPayload,
            expectedEventSlug: expectedEventSlug?.trim() || undefined,
          }),
          credentials: "include",
        });
        const data = (await res.json()) as CheckInResult;
        setResult(data);

        let outcome: RecentScan["outcome"] = "error";
        if (data.valid && !data.alreadyCheckedIn) outcome = "success";
        else if (data.valid && data.alreadyCheckedIn) outcome = "duplicate";

        playCheckInTone(outcome);
        vibrateCheckIn(outcome);

        const summary =
          data.registration?.fullName ||
          (typeof data.message === "string" ? data.message : "") ||
          data.error ||
          "Scan";
        setRecentScans((prev) =>
          [{ at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), summary, outcome }, ...prev].slice(
            0,
            10
          )
        );

        if (data.valid && !data.alreadyCheckedIn) setManualId("");
      } catch {
        setResult({ valid: false, error: "Check-in failed" });
        playCheckInTone("error");
        vibrateCheckIn("error");
        setRecentScans((prev) =>
          [
            {
              at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              summary: "Network or server error",
              outcome: "error" as const,
            },
            ...prev,
          ].slice(0, 10)
        );
      } finally {
        setLoading(false);
      }
    },
    [expectedEventSlug]
  );

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    void performCheckIn(manualId.trim());
  };

  useEffect(() => {
    if (mode !== "camera" || !containerRef.current) return;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader");
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            void scanner.pause(true);
            void performCheckIn(decodedText.trim()).finally(() => {
              void scanner.resume();
            });
          },
          () => {}
        );
        scannerRef.current = scanner;
        setScanning(true);
      } catch (err) {
        console.error("Scanner error:", err);
        setResult({ valid: false, error: "Could not access camera. Use manual entry." });
      }
    };

    startScanner();
    return () => {
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [mode, performCheckIn]);

  return (
    <div className="space-y-6">
      {expectedEventSlug ? (
        <div className="rounded-lg border border-accent-200 bg-accent-50/90 px-4 py-3 text-sm text-accent-950">
          <p className="font-medium">Event filter active</p>
          <p className="mt-1 text-accent-900/90">
            Only badges for{" "}
            <strong>{expectedEventTitle?.trim() || expectedEventSlug}</strong> will be accepted.{" "}
            <Link href="/admin/events/scan" className="font-medium underline decoration-accent-400 underline-offset-2">
              Clear filter
            </Link>
          </p>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            mode === "manual" ? "bg-accent-500 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Manual ID
        </button>
        <button
          type="button"
          onClick={() => setMode("camera")}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            mode === "camera" ? "bg-accent-500 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Scan QR
        </button>
      </div>

      {mode === "manual" && (
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value.toUpperCase())}
            placeholder="Enter Registration ID (e.g. AGC-EV-2025-XXXX)"
            className="flex-1 rounded-lg border border-border px-4 py-3 font-mono text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-accent-500 px-6 py-3 font-medium text-white hover:bg-accent-600 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Check In"}
          </button>
        </form>
      )}

      {mode === "camera" && (
        <div ref={containerRef}>
          <div id="qr-reader" className="rounded-lg overflow-hidden" />
          {!scanning && !result && (
            <p className="mt-2 text-sm text-slate-500">Camera will start. Point at the QR code on the badge.</p>
          )}
        </div>
      )}

      {recentScans.length > 0 && (
        <div className="rounded-xl border border-border bg-slate-50/90 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent scans</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {recentScans.map((r, i) => (
              <li key={`${r.at}-${i}`} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-mono text-xs text-slate-500">{r.at}</span>
                <span
                  className={
                    r.outcome === "success"
                      ? "font-medium text-green-800"
                      : r.outcome === "duplicate"
                        ? "font-medium text-amber-800"
                        : "font-medium text-red-800"
                  }
                >
                  {r.summary}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result && (
        <div
          className={`rounded-xl border-2 p-6 ${
            result.valid
              ? result.alreadyCheckedIn
                ? "border-accent-400 bg-accent-50"
                : "border-green-300 bg-green-50"
              : "border-red-300 bg-red-50"
          }`}
        >
          {result.valid ? (
            <>
              <p className={`font-bold ${result.alreadyCheckedIn ? "text-accent-800" : "text-green-800"}`}>
                {result.alreadyCheckedIn ? "Already checked in" : "Check-in successful"}
              </p>
              {result.registration && (
                <div className="mt-2 text-sm text-slate-700">
                  <p><strong>{result.registration.fullName}</strong></p>
                  {result.registration.organization && <p>{result.registration.organization}</p>}
                  <p>{result.registration.eventTitle}</p>
                  <p className="font-mono">{result.registration.registrationId}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <p className="font-bold text-red-800">Invalid</p>
              <p className="mt-1 text-sm text-red-700">{result.error || result.message}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
