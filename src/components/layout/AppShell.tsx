"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
