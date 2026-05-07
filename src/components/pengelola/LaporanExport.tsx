"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Loader2, ChevronDown } from "lucide-react";

interface BarRow {
  label: string;
  waterLevel: number;
  ph: number;
  turbidity: number;
  incidents: number;
}

interface Summary {
  totalDispenser: number;
  activeDispenser: number;
  avgWaterLevel: number;
  avgPh: number;
  avgTurbidity: number;
  avgTemp: number;
  totalIncidents: number;
  resolvedIncidents: number;
  uptimePct: number;
}

interface LaporanExportProps {
  period: string;
  dispenser: string;
  barData: BarRow[];
  summary: Summary;
}

type ExportFormat = "csv" | "json";

function buildCSV(barData: BarRow[], summary: Summary, period: string, dispenser: string): string {
  const lines: string[] = [];

  lines.push(`FillGo Station - Report`);
  lines.push(`Period,${period}`);
  lines.push(`Dispenser,${dispenser}`);
  lines.push(`Generated,${new Date().toLocaleString("id-ID")}`);
  lines.push(``);

  lines.push(`=== SUMMARY ===`);
  lines.push(`Active Dispensers,${summary.activeDispenser}/${summary.totalDispenser}`);
  lines.push(`Avg Water Level,${summary.avgWaterLevel}%`);
  lines.push(`Avg pH,${summary.avgPh}`);
  lines.push(`Avg Turbidity (NTU),${summary.avgTurbidity}`);
  lines.push(`Avg Temperature (°C),${summary.avgTemp}`);
  lines.push(`Uptime,${summary.uptimePct}%`);
  lines.push(`Total Incidents,${summary.totalIncidents}`);
  lines.push(`Resolved Incidents,${summary.resolvedIncidents}`);
  lines.push(``);

  lines.push(`=== PERIODIC DATA ===`);
  lines.push(`Period,Avg Water Level (%),Avg pH,Avg Turbidity (NTU),Incidents`);
  barData.forEach((row) => {
    lines.push(`${row.label},${row.waterLevel},${row.ph},${row.turbidity},${row.incidents}`);
  });

  return lines.join("\n");
}

function buildJSON(barData: BarRow[], summary: Summary, period: string, dispenser: string): string {
  return JSON.stringify(
    {
      meta: {
        title: "FillGo Station Report",
        period,
        dispenser,
        generatedAt: new Date().toISOString(),
      },
      summary,
      periodicData: barData,
    },
    null,
    2
  );
}

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LaporanExport({ period, dispenser, barData, summary }: LaporanExportProps) {
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setMenuOpen(false);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const slug = dispenser.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    const ts = new Date().toISOString().slice(0, 10);
    const filename = `fillgo_report_${slug}_${period}_${ts}.${format}`;

    if (format === "csv") {
      triggerDownload(buildCSV(barData, summary, period, dispenser), filename, "text/csv");
    } else {
      triggerDownload(buildJSON(barData, summary, period, dispenser), filename, "application/json");
    }

    setLastExport(format.toUpperCase());
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {lastExport && (
        <span className="text-xs text-green-600 font-medium hidden sm:block">
          ✓ {lastExport} exported
        </span>
      )}

      <div className="relative">
        <div className="flex rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          {/* Main export button (CSV default) */}
          <button
            onClick={() => handleExport("csv")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin text-blue-500" />
            ) : (
              <FileSpreadsheet size={15} className="text-green-500" />
            )}
            {loading ? "Generating..." : "Export CSV"}
          </button>

          {/* Dropdown arrow */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            disabled={loading}
            className="flex items-center px-2.5 py-2.5 border-l border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => handleExport("csv")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
            >
              <FileSpreadsheet size={15} className="text-green-500 shrink-0" />
              <div className="text-left">
                <p className="font-medium">Export CSV</p>
                <p className="text-xs text-gray-400">Spreadsheet format</p>
              </div>
            </button>
            <div className="border-t border-gray-100" />
            <button
              onClick={() => handleExport("json")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
            >
              <FileText size={15} className="text-blue-400 shrink-0" />
              <div className="text-left">
                <p className="font-medium">Export JSON</p>
                <p className="text-xs text-gray-400">Raw data format</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}