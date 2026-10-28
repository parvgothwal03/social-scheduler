import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PostAnalyticsItem {
  _id: string;
  content: string;
  platforms: string[];
  status: string;
  scheduledFor: string;
  updatedAt?: string;
  mediaType?: string;
}

export interface AnalyticsSummary {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  failedPosts: number;
  platformCounts: Record<string, number>;
}

// 1. Export as clean CSV
export const exportToCSV = (posts: PostAnalyticsItem[], filename = "analytics_report.csv") => {
  if (!posts || posts.length === 0) return;

  const headers = ["Post ID", "Content", "Platforms", "Status", "Media Type", "Scheduled For", "Updated At"];

  const rows = posts.map((post) => [
    `"${post._id}"`,
    `"${(post.content || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    `"${(post.platforms || []).join(", ")}"`,
    `"${post.status}"`,
    `"${post.mediaType || "none"}"`,
    `"${new Date(post.scheduledFor).toLocaleString()}"`,
    `"${post.updatedAt ? new Date(post.updatedAt).toLocaleString() : "N/A"}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 2. Export as professional, branded PDF
export const exportToPDF = (
  posts: PostAnalyticsItem[],
  summary: AnalyticsSummary,
  filename = "analytics_report.pdf"
) => {
  const doc = new jsPDF();

  // Primary Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, "F");

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Social Media Performance Report", 14, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);

  // Summary Metrics Section
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, 46);

  const metricsData = [
    [
      `Total Posts: ${summary.totalPosts}`,
      `Published: ${summary.publishedPosts}`,
      `Scheduled: ${summary.scheduledPosts}`,
      `Failed: ${summary.failedPosts}`,
    ],
  ];

  autoTable(doc, {
    startY: 50,
    body: metricsData,
    theme: "plain",
    styles: {
      fontSize: 10,
      fontStyle: "bold",
      textColor: [30, 41, 59],
      cellPadding: 3,
    },
  });

  // Platform Distribution
  const platformSummary = Object.entries(summary.platformCounts || {})
    .map(([platform, count]) => `${platform.toUpperCase()}: ${count}`)
    .join("   |   ");

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  doc.text(`Platform Distribution: ${platformSummary || "N/A"}`, 14, 66);

  // Detailed Posts Table
  const tableRows = posts.map((post) => [
    post.content.length > 50 ? post.content.substring(0, 50) + "..." : post.content,
    (post.platforms || []).join(", "),
    post.status.toUpperCase(),
    post.mediaType || "text",
    new Date(post.scheduledFor).toLocaleDateString(),
  ]);

  autoTable(doc, {
    startY: 72,
    head: [["Content", "Platforms", "Status", "Type", "Scheduled Date"]],
    body: tableRows,
    headStyles: {
      fillColor: [239, 68, 68], // red-500
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
  });

  // Save the document
  doc.save(filename);
};