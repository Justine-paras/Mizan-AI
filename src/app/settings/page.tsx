"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { getLocalStorageSettings, saveSettings, clearSettings, AppSettings } from "@/lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    geminiApiKey: "",
    supabaseUrl: "",
    supabaseAnonKey: "",
    supabaseServiceRoleKey: "",
  });

  const [showKeys, setShowKeys] = useState({
    geminiApiKey: false,
    supabaseAnonKey: false,
    supabaseServiceRoleKey: false,
  });
  const [isLocalDev, setIsLocalDev] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    setSettings(getLocalStorageSettings());
    
    async function checkStatus() {
      try {
        const res = await fetch("/api/settings/status");
        if (res.ok) {
          const data = await res.json();
          setIsLocalDev(data.isLocalDev);
        }
      } catch (err) {
        console.warn("Failed to fetch settings status:", err);
      }
    }
    checkStatus();
  }, []);

  const handleToggleShow = (field: keyof typeof showKeys) => {
    setShowKeys((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field: keyof AppSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate URLs if provided
      if (settings.supabaseUrl) {
        try {
          new URL(settings.supabaseUrl);
        } catch {
          setNotification({
            type: "error",
            message: "Supabase URL is invalid. Ensure it includes http:// or https://",
          });
          return;
        }
      }

      saveSettings(settings);

      if (isLocalDev) {
        const saveRes = await fetch("/api/settings/save-env", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        if (!saveRes.ok) {
          const errData = await saveRes.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to persist env files to disk.");
        }
      }

      setNotification({
        type: "success",
        message: isLocalDev 
          ? "Settings saved successfully! Active connection overrides are set and persisted in .env.local."
          : "Settings saved successfully! Custom connections are now active.",
      });
      
      // Auto clear alert after 4 seconds
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        type: "error",
        message: `Failed to save settings: ${err.message || err}`,
      });
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to clear your custom settings and fall back to the system defaults?")) {
      clearSettings();
      
      if (isLocalDev) {
        try {
          await fetch("/api/settings/save-env", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              geminiApiKey: "",
              supabaseUrl: "",
              supabaseAnonKey: "",
              supabaseServiceRoleKey: "",
            }),
          });
        } catch (err) {
          console.warn("Failed to clear .env.local on default reset:", err);
        }
      }

      const defaults = {
        geminiApiKey: "",
        supabaseUrl: "",
        supabaseAnonKey: "",
        supabaseServiceRoleKey: "",
      };
      setSettings(defaults);
      setNotification({
        type: "success",
        message: "Configuration reset to default system environment keys successfully.",
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <AppShell>
      <div className="px-8 py-10 max-w-3xl mx-auto animate-fade-in">
        {/* Page Header */}
        <div className="mb-8">
          {isLocalDev && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-accent/15 text-accent border border-accent/25 uppercase tracking-wider mb-3.5 animate-scale-in">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Local Development Mode
            </span>
          )}
          <h1 className="t-display">Settings</h1>
          <p className="t-body mt-1">
            Configure custom API keys and database integrations. These browser overrides let you isolate tests or run compliance analyses against custom backend services.
          </p>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg border text-xs flex items-center justify-between animate-slide-up ${
              notification.type === "success"
                ? "bg-success/10 border-success/20 text-success"
                : "bg-critical/10 border-critical/20 text-critical"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{notification.type === "success" ? "✓" : "⚠️"}</span>
              <p className="font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-text-tertiary hover:text-text-primary ml-4"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Gemini Settings */}
          <div className="card p-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary tracking-tight">Gemini AI Settings</h2>
              <p className="text-2xs text-text-tertiary mt-0.5">
                Configure your custom Gemini model connection key. Leaving this empty falls back to the default server API model.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="geminiApiKey" className="text-2xs font-semibold text-text-secondary uppercase tracking-wider block">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  id="geminiApiKey"
                  type={showKeys.geminiApiKey ? "text" : "password"}
                  value={settings.geminiApiKey}
                  onChange={(e) => handleInputChange("geminiApiKey", e.target.value)}
                  placeholder="Enter custom Gemini API Key"
                  className="w-full bg-bg-base border border-border-strong rounded-md px-3 py-2 text-xs text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-accent transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => handleToggleShow("geminiApiKey")}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-text-tertiary hover:text-text-primary text-xs"
                >
                  {showKeys.geminiApiKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {/* Supabase Settings */}
          <div className="card p-6 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-text-primary tracking-tight">Supabase DB & Storage Settings</h2>
              <p className="text-2xs text-text-tertiary mt-0.5">
                Configure database connections and file storage locations for tracking compliance audits.
              </p>
            </div>

            <div className="space-y-4">
              {/* URL */}
              <div className="space-y-2">
                <label htmlFor="supabaseUrl" className="text-2xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Supabase Project URL
                </label>
                <input
                  id="supabaseUrl"
                  type="text"
                  value={settings.supabaseUrl}
                  onChange={(e) => handleInputChange("supabaseUrl", e.target.value)}
                  placeholder="https://your-project-id.supabase.co"
                  className="w-full bg-bg-base border border-border-strong rounded-md px-3 py-2 text-xs text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              {/* Anon key */}
              <div className="space-y-2">
                <label htmlFor="supabaseAnonKey" className="text-2xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Supabase Anonymous (Public) Key
                </label>
                <div className="relative">
                  <input
                    id="supabaseAnonKey"
                    type={showKeys.supabaseAnonKey ? "text" : "password"}
                    value={settings.supabaseAnonKey}
                    onChange={(e) => handleInputChange("supabaseAnonKey", e.target.value)}
                    placeholder="Enter custom Supabase Anon Key"
                    className="w-full bg-bg-base border border-border-strong rounded-md px-3 py-2 text-xs text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-accent transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => handleToggleShow("supabaseAnonKey")}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-text-tertiary hover:text-text-primary text-xs"
                  >
                    {showKeys.supabaseAnonKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Service role key */}
              <div className="space-y-2">
                <label htmlFor="supabaseServiceRoleKey" className="text-2xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Supabase Service Role Key (Server Write Access)
                </label>
                <div className="relative">
                  <input
                    id="supabaseServiceRoleKey"
                    type={showKeys.supabaseServiceRoleKey ? "text" : "password"}
                    value={settings.supabaseServiceRoleKey}
                    onChange={(e) => handleInputChange("supabaseServiceRoleKey", e.target.value)}
                    placeholder="Enter custom Supabase Service Role Key"
                    className="w-full bg-bg-base border border-border-strong rounded-md px-3 py-2 text-xs text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-accent transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => handleToggleShow("supabaseServiceRoleKey")}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-text-tertiary hover:text-text-primary text-xs"
                  >
                    {showKeys.supabaseServiceRoleKey ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button type="submit" variant="primary" size="md" id="save-settings-btn">
              Save Configuration
            </Button>
            <Button type="button" variant="secondary" size="md" onClick={handleReset} id="reset-settings-btn">
              Reset to System Defaults
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
