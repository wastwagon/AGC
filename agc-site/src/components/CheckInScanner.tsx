"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

type CheckInResult = {
  valid: boolean;
  alreadyCheckedIn?: boolean;
  registration?: {
    fullName: string;
    organization?: string;
    eventTitle: string;
    registrationId: string;
    checkedInAt?: string;
  };
  message?: string;
  error?: string;
};

export function CheckInScanner() {
  const [mode, setMode] = useState<"manual" | "camera">("manual");
  const [manualId, setManualId] = useState("");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const performCheckIn = useCallback(async (qrToken?: string, registrationId?: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/events/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken: qrToken || undefined, registrationId: registrationId || undefined }),
        credentials: "include",
      });
      const data = await res.json();
      setResult(data);
      if (data.valid && !data.alreadyCheckedIn) setManualId("");
    } catch {
      setResult({ valid: false, error: "Check-in failed" });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    performCheckIn(undefined, manualId.trim());
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
            scanner.pause();
            performCheckIn(decodedText);
            setScanning(false);
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
            className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm"
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
