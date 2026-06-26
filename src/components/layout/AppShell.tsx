"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getSettingsHeaders } from "@/lib/settings";

// ─── Icons (inline SVGs — no icon library dependency) ────────────────────────

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M2.5 10.5v2a1 1 0 001 1h9a1 1 0 001-1v-2M8 9.5V2.5M5.5 5l2.5-2.5L10.5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M8 1.5L2.5 4v4c0 3 2.5 5.5 5.5 6 3-0.5 5.5-3 5.5-6V4L8 1.5z" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M2.5 2.5h11a1 1 0 011 1v7a1 1 0 01-1 1H5.5l-3 2.5V3.5a1 1 0 011-1z" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M9.5 1.5H4a1 1 0 00-1 1v11a1 1 0 001 1h8a1 1 0 001-1V5l-3.5-3.5z" strokeLinejoin="round" />
      <path d="M9.5 1.5V5H13.5" strokeLinejoin="round" />
      <path d="M5.5 9h5M5.5 11h3" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" strokeWidth="1.5" stroke="currentColor">
      <path d="M2.5 3A1.5 1.5 0 014 1.5h8A1.5 1.5 0 0113.5 3v10a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 13V3z" strokeLinejoin="round" />
      <path d="M5.5 1.5V13M9.5 4h2M9.5 6.5h2M9.5 9h2" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" strokeWidth="1.5" stroke="currentColor">
      <circle cx="8" cy="8" r="2" />
      <path d="M12.5 8a4.5 4.5 0 00-9 0m4.5-4.5a4.5 4.5 0 000 9M2.5 2.5l2 2m7 7l2 2m-11 9l2-2m7-7l2-2" strokeLinecap="round" />
    </svg>
  );
}


// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  { label: "Upload",      href: "/upload",      icon: UploadIcon },
  { label: "Analysis",    href: "/analysis",    icon: ShieldIcon },
  { label: "Chat",        href: "/chat",        icon: ChatIcon   },
  { label: "Report",      href: "/report",      icon: FileIcon   },
  { label: "Regulations", href: "/regulations", icon: BookIcon   },
  { label: "Settings",    href: "/settings",    icon: SettingsIcon },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [audits, setAudits] = useState<{ id: string; documentName: string; score: number; createdAt: string; risk: string }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Parse out the active ID from pathname if present (e.g. /dashboard/uuid -> uuid)
  const idMatch = pathname.match(/\/(dashboard|analysis|chat|report)\/([a-f0-9-]+)/i);
  const currentId = idMatch ? idMatch[2] : null;

  useEffect(() => {
    async function loadAudits() {
      try {
        const res = await fetch("/api/analyze", {
          headers: getSettingsHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setAudits(data);
          
          if (currentId) {
            setSelectedId(currentId);
          } else {
            const stored = localStorage.getItem("latest_analysis_id");
            if (stored) {
              setSelectedId(stored);
            } else if (data.length > 0) {
              setSelectedId(data[0].id);
              localStorage.setItem("latest_analysis_id", data[0].id);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to load audits for sidebar list:", err);
      }
    }
    loadAudits();
  }, [currentId]);

  const currentAudit = audits.find(a => a.id === selectedId) || audits[0] || null;

  const handleSwitchAudit = (id: string) => {
    setSelectedId(id);
    localStorage.setItem("latest_analysis_id", id);
    setDropdownOpen(false);
    
    if (idMatch) {
      const route = idMatch[1];
      router.push(`/${route}/${id}`);
    } else {
      router.push(`/dashboard/${id}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border bg-bg-surface">
        {/* Wordmark */}
        <div className="h-16 flex items-center px-3 border-b border-border">
          <Link href="/" className="flex justify-start hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-cropped.png"
              alt="Mizan"
              className="max-w-[140px] h-auto object-contain"
            />
          </Link>
        </div>

        {/* Audit Record Switcher */}
        {audits.length > 0 && (
          <div className="px-3 py-3 border-b border-border bg-white/[0.01] relative select-none">
            <label className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider block mb-1">
              Active Audit Record
            </label>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-bg-elevated hover:bg-bg-elevated/80 border border-border hover:border-border-strong rounded-lg text-left transition-all cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {currentAudit?.documentName || "Select Audit..."}
                  </p>
                  {currentAudit && (
                    <p className="text-[10px] text-text-secondary mt-0.5 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        currentAudit.risk === "high" ? "bg-critical" : currentAudit.risk === "medium" ? "bg-warning" : "bg-success"
                      }`} />
                      Score: {currentAudit.score}/100
                    </p>
                  )}
                </div>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={cn("w-3.5 h-3.5 text-text-tertiary transition-transform ml-1 flex-shrink-0", dropdownOpen && "rotate-180")}
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 right-0 mt-1.5 bg-bg-surface border border-border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto py-1 scrollbar-thin">
                  {audits.map((audit) => (
                    <button
                      key={audit.id}
                      onClick={() => handleSwitchAudit(audit.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/[0.03] flex flex-col gap-0.5",
                        audit.id === selectedId ? "bg-accent/5 text-accent font-semibold" : "text-text-secondary"
                      )}
                    >
                      <span className="truncate block font-medium text-text-primary">{audit.documentName}</span>
                      <div className="flex items-center justify-between text-[9px] text-text-tertiary font-mono">
                        <span>Score: {audit.score}/100</span>
                        <span>{new Date(audit.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 h-9 rounded-md text-sm transition-all duration-150",
                  active
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-accent" : "text-text-tertiary")} />
                {label}
              </Link>
            );
          })}
        </nav>


      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
