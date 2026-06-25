export interface AppSettings {
  geminiApiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
}

const STORAGE_KEYS = {
  GEMINI_API_KEY: "mizan_settings_gemini_api_key",
  SUPABASE_URL: "mizan_settings_supabase_url",
  SUPABASE_ANON_KEY: "mizan_settings_supabase_anon_key",
  SUPABASE_SERVICE_ROLE_KEY: "mizan_settings_supabase_service_role_key",
};

export function getLocalStorageSettings(): AppSettings {
  if (typeof window === "undefined") {
    return {
      geminiApiKey: "",
      supabaseUrl: "",
      supabaseAnonKey: "",
      supabaseServiceRoleKey: "",
    };
  }

  return {
    geminiApiKey: localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || "",
    supabaseUrl: localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || "",
    supabaseAnonKey: localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || "",
    supabaseServiceRoleKey: localStorage.getItem(STORAGE_KEYS.SUPABASE_SERVICE_ROLE_KEY) || "",
  };
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === "undefined") return;

  if (settings.geminiApiKey !== undefined) {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, settings.geminiApiKey.trim());
  }
  if (settings.supabaseUrl !== undefined) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, settings.supabaseUrl.trim());
  }
  if (settings.supabaseAnonKey !== undefined) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, settings.supabaseAnonKey.trim());
  }
  if (settings.supabaseServiceRoleKey !== undefined) {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_SERVICE_ROLE_KEY, settings.supabaseServiceRoleKey.trim());
  }
}

export function clearSettings(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSettingsHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (typeof window !== "undefined") {
    const geminiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    const supabaseUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
    const supabaseAnon = localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
    const supabaseServiceRole = localStorage.getItem(STORAGE_KEYS.SUPABASE_SERVICE_ROLE_KEY);

    if (geminiKey) headers["x-gemini-api-key"] = geminiKey;
    if (supabaseUrl) headers["x-supabase-url"] = supabaseUrl;
    if (supabaseAnon) headers["x-supabase-anon-key"] = supabaseAnon;
    if (supabaseServiceRole) headers["x-supabase-service-role-key"] = supabaseServiceRole;
  }
  
  return headers;
}
