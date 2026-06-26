import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { Analysis, Document as DbDoc } from "@/types";

interface ReportInput {
  document: DbDoc;
  analysis: Analysis;
}

// Minimal styling for clean, executive PDF prints
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 15,
    marginBottom: 20,
  },
  logo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7C5CFF",
  },
  logoArabic: {
    fontSize: 14,
    color: "#9ca3af",
  },
  docTitle: {
    fontSize: 10,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "right",
  },
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderRadius: 6,
    padding: 15,
  },
  metaCol: {
    width: "48%",
  },
  metaItem: {
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "bold",
  },
  scoreSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 15,
    marginBottom: 30,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7C5CFF",
  },
  riskBadge: {
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 5,
    marginTop: 20,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  paragraph: {
    fontSize: 9.5,
    color: "#4b5563",
    lineHeight: 1.5,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
    paddingLeft: 10,
  },
  bulletDot: {
    width: 3,
    height: 3,
    backgroundColor: "#7C5CFF",
    borderRadius: 1.5,
    marginTop: 5,
    marginRight: 6,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 9.5,
    color: "#4b5563",
    flex: 1,
    lineHeight: 1.4,
  },
  issueItem: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 12,
  },
  issueTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 2,
  },
  issueDesc: {
    fontSize: 9,
    color: "#4b5563",
    lineHeight: 1.4,
    marginBottom: 3,
  },
  issueRec: {
    fontSize: 8.5,
    color: "#7C5CFF",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    paddingVertical: 6,
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    color: "#374151",
    paddingHorizontal: 4,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
    paddingHorizontal: 4,
  },
});

// A React Component to represent the PDF Layout
function PDFDocument({ document: dbDoc, analysis, shortSummary, detailedReport }: { 
  document: DbDoc; 
  analysis: Analysis; 
  shortSummary: string; 
  detailedReport: string; 
}) {
  const isHighRisk = analysis.risk === "high";
  const isMedRisk = analysis.risk === "medium";

  const riskColor = isHighRisk ? "#ef4444" : isMedRisk ? "#f97316" : "#22c55e";
  const riskBg = isHighRisk ? "#fee2e2" : isMedRisk ? "#ffedd5" : "#dcfce7";

  // Parse lines of the detailed report into React PDF elements
  const parseDetailedReport = (text: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    
    let tableHeader: string[] = [];
    let tableRows: string[][] = [];
    let isInTable = false;

    const flushTable = (key: number) => {
      if (tableHeader.length > 0 || tableRows.length > 0) {
        elements.push(
          <View key={`table-${key}`} style={{ marginVertical: 12, borderWidth: 0.5, borderColor: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
            {tableHeader.length > 0 && (
              <View style={styles.tableHeader}>
                {tableHeader.map((cell, cIdx) => (
                  <Text key={cIdx} style={styles.tableCellHeader}>{cell}</Text>
                ))}
              </View>
            )}
            {tableRows.map((row, rIdx) => (
              <View key={rIdx} style={styles.tableRow}>
                {row.map((cell, cIdx) => (
                  <Text key={cIdx} style={styles.tableCell}>{cell}</Text>
                ))}
              </View>
            ))}
          </View>
        );
        tableHeader = [];
        tableRows = [];
      }
      isInTable = false;
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const trimmed = line.trim();

      // 1. Process Tables
      if (trimmed.startsWith("|")) {
        isInTable = true;
        const cells = trimmed.split("|").slice(1, -1).map(c => c.trim());
        const isSeparator = cells.every(c => c.match(/^:-*-?:*$/) || c.match(/^-+$/));
        if (isSeparator) continue;

        if (tableHeader.length === 0) {
          tableHeader = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else {
        if (isInTable) {
          flushTable(idx);
        }
      }

      // 2. Process Lists
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        elements.push(
          <View key={`list-${idx}`} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{trimmed.substring(1).trim().replace(/\*\*/g, "")}</Text>
          </View>
        );
        continue;
      }

      // 3. Process Headings
      if (trimmed.startsWith("#")) {
        const title = trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, "");
        elements.push(
          <Text key={`h-${idx}`} style={[styles.sectionTitle, { marginTop: 15 }]}>{title}</Text>
        );
        continue;
      }

      if (trimmed.match(/^\d+\.\s/)) {
        elements.push(
          <Text key={`num-${idx}`} style={[styles.sectionTitle, { marginTop: 15, borderBottomColor: "#cbd5e1" }]}>
            {trimmed.replace(/\*\*/g, "")}
          </Text>
        );
        continue;
      }

      // 4. Regular Paragraphs
      if (trimmed) {
        elements.push(
          <Text key={`p-${idx}`} style={styles.paragraph}>{trimmed.replace(/\*\*/g, "")}</Text>
        );
      }
    }

    if (isInTable) flushTable(lines.length);
    return elements;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>MIZAN</Text>
            <Text style={styles.logoArabic}>Tax Copilot</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>UAE VAT Compliance Audit</Text>
            <Text style={{ fontSize: 8, color: "#9ca3af", textAlign: "right" }}>FTA Standards Report</Text>
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Reference Number</Text>
              <Text style={styles.metaValue}>REF-{analysis.id.slice(0, 8).toUpperCase()}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Primary File</Text>
              <Text style={styles.metaValue}>{dbDoc.name}</Text>
            </View>
          </View>
          <View style={styles.metaCol}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Audit Date</Text>
              <Text style={styles.metaValue}>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Regulations Mapped</Text>
              <Text style={styles.metaValue}>Federal Decree-Law No. 8 of 2017</Text>
            </View>
          </View>
        </View>

        {/* Score & Risk Summary */}
        <View style={styles.scoreSection}>
          <View>
            <Text style={styles.scoreLabel}>VAT Compliance Rating</Text>
            <Text style={{ fontSize: 9, color: "#6b7280", marginTop: 2 }}>Calculated by automated FTA rules engine</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={[styles.riskBadge, { color: riskColor, backgroundColor: riskBg }]}>
              {analysis.risk} Risk
            </Text>
            <Text style={styles.scoreValue}>{analysis.score}/100</Text>
          </View>
        </View>

        {/* Executive Summary */}
        <Text style={styles.sectionTitle}>Executive Compliance Summary</Text>
        <Text style={styles.paragraph}>{shortSummary}</Text>

        {/* Gaps/Issues List */}
        {analysis.issues && analysis.issues.length > 0 && (
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.sectionTitle}>Compliance Flags & GAP Analysis</Text>
            {analysis.issues.map((iss, idx) => {
              const issColor = iss.severity === "high" ? "#ef4444" : iss.severity === "medium" ? "#f97316" : "#22c55e";
              return (
                <View key={idx} style={[styles.issueItem, { borderLeftColor: issColor }]}>
                  <Text style={styles.issueTitle}>{iss.title} ({iss.severity.toUpperCase()})</Text>
                  <Text style={styles.issueDesc}>{iss.description}</Text>
                  {iss.recommendation && (
                    <Text style={styles.issueRec}>Recommendation: {iss.recommendation}</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Detailed audit Trail */}
        {detailedReport && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Detailed Compliance Report Details</Text>
            {parseDetailedReport(detailedReport)}
          </View>
        )}
      </Page>
    </Document>
  );
}

/**
 * Generate a PDF audit report from analysis data.
 * @param input - Document and analysis records
 * @returns PDF as a Buffer
 */
export async function generatePdf(input: ReportInput): Promise<Buffer> {
  const { document, analysis } = input;

  let shortSummary = "";
  let detailedReport = "";
  try {
    const parsed = JSON.parse(analysis.summary);
    shortSummary = parsed.short || "";
    detailedReport = parsed.detailed || "";
  } catch (e) {
    shortSummary = analysis.summary;
    detailedReport = "";
  }

  // Generate buffer from the React PDF component tree
  const buffer = await renderToBuffer(
    React.createElement(PDFDocument, {
      document,
      analysis,
      shortSummary,
      detailedReport
    }) as any
  );

  return buffer;
}
