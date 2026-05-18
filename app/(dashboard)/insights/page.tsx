"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getTransactions } from "@/app/services/transaction.service";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  over: { label: "Overspending", color: "#ef4444", bg: "#fef2f2", icon: "⚠️" },
  under: {
    label: "Underspending",
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: "💡",
  },
  good: { label: "On Track", color: "#16a34a", bg: "#f0fdf4", icon: "✅" },
};

export default function InsightsPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // calculate from recommendations state
  const onTrack = recommendations.filter(
    (r: any) => r.status === "good",
  ).length;
  const overspending = recommendations.filter(
    (r: any) => r.status === "over",
  ).length;
  const underspending = recommendations.filter(
    (r: any) => r.status === "under",
  ).length;

  function totalCalculation(transactions: any) {
    const incomeTransaction = transactions.filter(
      (f: any) => f.type === "income",
    );

    const income = incomeTransaction.reduce(
      (sum: any, t: any) => sum + Number(t.amount),
      0,
    );

    setMonthlyIncome(income);
  }

  async function getAllTransaction() {
    const res = await getTransactions();
    const list = res["data"]["data"];

    if (list.length) {
      totalCalculation(list);
      await analyzebudget(list); // 👈 add this
    }
  }

  function groupByCategory(transactions: any[]) {
    const map: Record<string, number> = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!map[t.category]) map[t.category] = 0;
        map[t.category] += Number(t.amount);
      });

    return Object.entries(map).map(([category, spent]) => ({
      category,
      spent,
      currentBudget: 0, // no budget data in transactions — set 0
    }));
  }

  async function analyzebudget(transactions: any[]) {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const spending = groupByCategory(transactions);

    setIsLoading(true);

    const res = await fetch("/api/budget-recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monthlyIncome: income,
        spending,
      }),
    });

    const data = await res.json();
    setRecommendations(data.recommendations);
    setSummary(data.summary);

    setIsLoading(false);
  }

  useEffect(() => {
    getAllTransaction();
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>AI Budget Insights</h2>
          <p className={styles.subtitle}>
            Personalized budget recommendations powered by Gemini AI
          </p>
        </div>
        <button className={styles.refreshBtn}>✨ Refresh Insights</button>
      </div>

      {/* ── Summary card ── */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryLeft}>
          <div className={styles.aiIcon}>🤖</div>
          <div>
            <p className={styles.summaryTitle}>Financial Health Summary</p>
            <p className={styles.summaryText}>
              {summary || "Analyzing your finances..."}
            </p>
          </div>
        </div>
        <div className={styles.summaryStats}>
          <div className={styles.stat}>
            <p className={styles.statNum} style={{ color: "#16a34a" }}>
              {onTrack}
            </p>
            <p className={styles.statLabel}>On Track</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNum} style={{ color: "#ef4444" }}>
              {overspending}
            </p>
            <p className={styles.statLabel}>Overspending</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNum} style={{ color: "#f59e0b" }}>
              {underspending}
            </p>
            <p className={styles.statLabel}>Underspending</p>
          </div>
        </div>
      </div>
      {/* ── Recommendations grid ── */}
      <div className={styles.grid}>
        {isLoading ? <p>✨ Analyzing your finances...</p> : ""}
        {recommendations.length === 0 && !isLoading ? (
          <div className={styles.emptyState}>
            <p>No transactions found.</p>
            <p>Add some transactions first to get AI budget recommendations.</p>
          </div>
        ) : null}
        {!isLoading &&
          recommendations &&
          recommendations.map((rec: any) => {
            const config = statusConfig[rec.status];
            const diff = rec.recommendedBudget - rec.currentBudget;

            return (
              <div key={rec.category} className={styles.card}>
                {/* Card header */}
                <div className={styles.cardHeader}>
                  <p className={styles.cardCategory}>{rec.category}</p>
                  <span
                    className={styles.badge}
                    style={{ color: config.color, background: config.bg }}
                  >
                    {config.icon} {config.label}
                  </span>
                </div>

                {/* Budget comparison */}
                <div className={styles.budgetRow}>
                  <div className={styles.budgetItem}>
                    <p className={styles.budgetLabel}>Current</p>
                    <p className={styles.budgetAmount}>${rec.currentBudget}</p>
                  </div>
                  <div className={styles.arrow}>→</div>
                  <div className={styles.budgetItem}>
                    <p className={styles.budgetLabel}>Recommended</p>
                    <p
                      className={styles.budgetAmount}
                      style={{ color: config.color }}
                    >
                      ${rec.recommendedBudget}
                    </p>
                  </div>
                  <div className={styles.budgetItem}>
                    <p className={styles.budgetLabel}>Change</p>
                    <p
                      className={styles.budgetAmount}
                      style={{ color: diff >= 0 ? "#16a34a" : "#ef4444" }}
                    >
                      {diff >= 0 ? "+" : ""}${diff}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <div className={styles.reason}>
                  <p className={styles.reasonText}>{rec.reason}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
