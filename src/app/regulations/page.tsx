"use client";

import { useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import { REGULATION_ARTICLES, RegulationArticle } from "@/lib/compliance/regulationText";
import Button from "@/components/ui/Button";

// Inline SVG Icons for premium UI look
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function FilePdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const CATEGORIES = [
  "All",
  "General",
  "Registration",
  "Rules",
  "Zero-Rate",
  "Exemptions",
  "Input Tax",
  "Invoices",
  "Records",
];

const QUICK_LINKS = [
  { title: "Article 53 – Non-recoverable Input Tax", id: "article-53", desc: "Hospitality & cars rules" },
  { title: "Article 59 – Tax Invoice Elements", id: "article-59", desc: "Required fields checklist" },
  { title: "Article 7 – Mandatory Threshold", id: "article-7", desc: "AED 375,000 criteria" },
  { title: "Article 42 – Financial Exemption", id: "article-42", desc: "Vat-exempt financial products" },
];

export default function RegulationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticleId, setSelectedArticleId] = useState("article-53");
  const [activeTab, setActiveTab] = useState<"articles" | "pdf">("articles");

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return REGULATION_ARTICLES.filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "All" || art.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Selected article detail
  const activeArticle = useMemo(() => {
    return (
      REGULATION_ARTICLES.find((art) => art.id === selectedArticleId) ||
      REGULATION_ARTICLES[0]
    );
  }, [selectedArticleId]);

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-bg-base text-text-primary overflow-hidden animate-fade-in">
        {/* Page Top Header */}
        <div className="px-8 py-6 border-b border-border bg-bg-surface/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-shrink-0">
          <div>
            <p className="t-label mb-1">UAE Federal Tax Authority (FTA)</p>
            <h1 className="t-display">VAT Executive Regulations</h1>
            <p className="t-body mt-1 max-w-xl">
              Executive Regulation of the Federal Decree-Law No. 8 of 2017 on Value Added Tax, including all official amendments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={activeTab === "articles" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("articles")}
              className="flex items-center gap-2"
            >
              <BookOpenIcon className="w-4 h-4" />
              Browsable Directory
            </Button>
            <Button
              variant={activeTab === "pdf" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("pdf")}
              className="flex items-center gap-2"
            >
              <FilePdfIcon className="w-4 h-4" />
              Official PDF Viewer
            </Button>
          </div>
        </div>

        {/* Tab content 1: Directory */}
        {activeTab === "articles" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column: Search & Scrollable list of articles */}
            <div className="w-[340px] border-r border-border flex flex-col bg-bg-surface/10 flex-shrink-0">
              {/* Search input */}
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, rules..."
                    className="w-full bg-bg-elevated border border-border focus:border-accent text-xs rounded-lg pl-9 pr-3 h-9 text-text-primary outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Category Quick Filter Chips */}
              <div className="p-3 border-b border-border overflow-x-auto flex gap-1.5 scrollbar-thin select-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-[10px] rounded-full font-medium transition-all flex-shrink-0 ${
                      selectedCategory === cat
                        ? "bg-accent/15 border border-accent/30 text-accent font-semibold"
                        : "bg-white/[0.02] border border-border/40 text-text-secondary hover:bg-white/[0.04]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scrollable list of filtered articles */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((art) => (
                    <button
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-1 ${
                        selectedArticleId === art.id
                          ? "bg-accent/5 border-accent/25 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-white/[0.02] hover:border-border/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                          art.category === "Input Tax" || art.category === "Invoices"
                            ? "bg-critical/10 border border-critical/20 text-critical"
                            : art.category === "Zero-Rate" || art.category === "Exemptions"
                            ? "bg-success/10 border border-success/20 text-success"
                            : "bg-accent/10 border border-accent/20 text-accent"
                        }`}>
                          {art.category}
                        </span>
                        <span className="text-[9px] text-text-tertiary font-mono">
                          {art.id.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xs font-semibold text-text-primary line-clamp-1">
                        {art.title}
                      </h3>
                      <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center text-text-tertiary flex flex-col items-center justify-center gap-2">
                    <span className="text-lg">🔍</span>
                    <p className="text-xs">No matching articles found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Detailed article display and Quick references panel */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-bg-base">
              {/* Central Reading area */}
              <div className="flex-1 overflow-y-auto p-8 border-r border-border/40 scrollbar-thin">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Category badge + title */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-accent/10 border border-accent/25 text-accent rounded uppercase tracking-wider">
                        {activeArticle.category}
                      </span>
                      <span className="text-xs text-text-tertiary font-mono">FTA Regulation Index</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-text-primary leading-tight">
                      {activeArticle.title}
                    </h2>
                  </div>

                  {/* Summary Callout Box */}
                  <div className="p-4 rounded-xl border bg-bg-surface/50 border-border/80 text-xs text-text-secondary leading-relaxed flex gap-3">
                    <span className="text-base text-accent">ℹ️</span>
                    <div>
                      <p className="font-semibold text-text-primary mb-0.5">Quick Summary</p>
                      <p className="text-text-secondary font-medium">{activeArticle.summary}</p>
                    </div>
                  </div>

                  {/* Actual text body */}
                  <div className="border-t border-border/40 pt-6">
                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-4">Official Executive Text</p>
                    <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-sans bg-bg-surface/20 border border-border/30 rounded-xl p-5 font-medium">
                      {activeArticle.content}
                    </div>
                  </div>

                  {/* Verification Note */}
                  <div className="flex items-center gap-2.5 text-2xs text-text-tertiary bg-white/[0.01] border border-border/20 rounded-lg p-3">
                    <CheckCircleIcon className="w-4 h-4 text-success flex-shrink-0" />
                    <span>Ground truth verified under UAE Federal Decree-Law No. 8 of 2017. Updates apply through 2026.</span>
                  </div>
                </div>
              </div>

              {/* Quick lookup widget panel */}
              <div className="w-full lg:w-72 bg-bg-surface/10 p-6 flex-shrink-0 border-t lg:border-t-0 border-border overflow-y-auto scrollbar-thin">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FilterIcon className="w-3.5 h-3.5" />
                      Key Regulations
                    </h4>
                    <p className="text-2xs text-text-secondary leading-relaxed mb-4">
                      Direct shortcuts to the most critical articles referenced during corporate tax compliance audits:
                    </p>
                    
                    {/* Quick Link Buttons */}
                    <div className="space-y-2">
                      {QUICK_LINKS.map((link) => (
                        <button
                          key={link.id}
                          onClick={() => {
                            setSelectedArticleId(link.id);
                            setSelectedCategory("All");
                          }}
                          className={`w-full text-left p-3 rounded-lg border text-xs flex flex-col gap-0.5 transition-all ${
                            selectedArticleId === link.id
                              ? "bg-accent/10 border-accent/30 text-accent font-semibold"
                              : "bg-white/[0.01] border-border/40 hover:bg-white/[0.03] hover:border-border text-text-secondary"
                          }`}
                        >
                          <span className="font-semibold text-text-primary line-clamp-1">{link.title}</span>
                          <span className="text-[10px] text-text-tertiary">{link.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Resources card */}
                  <div className="border border-border/80 bg-bg-surface/50 rounded-xl p-4 space-y-3">
                    <h5 className="text-[10px] font-bold text-text-primary uppercase tracking-wider">FTA Resources</h5>
                    <p className="text-2xs text-text-secondary leading-relaxed">
                      Need formal clarification? Visit the Federal Tax Authority portal to verify TRNs or submit administrative inquiries.
                    </p>
                    <a
                      href="https://tax.gov.ae"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-1.5 bg-bg-elevated border border-border hover:bg-white/[0.02] text-text-primary rounded text-2xs font-semibold tracking-wider transition-colors"
                    >
                      Official FTA Portal
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tab content 2: Interactive PDF Viewer */
          <div className="flex-1 p-8 bg-bg-base overflow-hidden flex flex-col">
            <div className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Direct PDF Stream: public/uae-vat-regulations.pdf
                </span>
                <a
                  href="/uae-vat-regulations.pdf"
                  download
                  className="px-3 py-1.5 rounded bg-bg-surface hover:bg-bg-elevated text-xs font-semibold text-text-primary border border-border flex items-center gap-1.5 transition-colors"
                >
                  📥 Download PDF
                </a>
              </div>
              <div className="flex-1 border border-border rounded-xl bg-bg-surface overflow-hidden relative shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <iframe
                  src="/uae-vat-regulations.pdf"
                  className="w-full h-full border-none"
                  title="UAE VAT Regulations Official Document"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
