// Shared TypeScript types — mirrors SCHEMA.sql

export interface Document {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export interface Analysis {
  id: string;
  document_id: string;
  score: number;          // 0–100
  risk: "low" | "medium" | "high";
  issues: Issue[];        // stored as JSONB in DB
  summary: string;
}

export interface Issue {
  title: string;
  severity: "low" | "medium" | "high";
  description: string;
  recommendation?: string;
}

export interface Message {
  id: string;
  analysis_id: string;
  role: "user" | "assistant";
  content: string;
}

export interface Report {
  id: string;
  analysis_id: string;
  url: string;
}
