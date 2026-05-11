"use client";

import Link from "next/link";
import styles from "./page.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
const PIE_COLORS = [
  "#16a34a",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

const recentTransactions = [
  {
    id: "1",
    title: "Grocery Shopping",
    amount: 85.5,
    type: "expense",
    category: "Food & Dining",
    date: "2026-05-10",
  },
  {
    id: "2",
    title: "Monthly Salary",
    amount: 3500,
    type: "income",
    category: "Salary",
    date: "2026-05-01",
  },
  {
    id: "3",
    title: "Netflix Subscription",
    amount: 15.99,
    type: "expense",
    category: "Entertainment",
    date: "2026-05-08",
  },
  {
    id: "4",
    title: "Freelance Project",
    amount: 800,
    type: "income",
    category: "Freelance",
    date: "2026-05-07",
  },
  {
    id: "5",
    title: "Uber Ride",
    amount: 12.5,
    type: "expense",
    category: "Transport",
    date: "2026-05-06",
  },
];

const categoryIcons: Record<string, string> = {
  "Food & Dining": "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Health: "💊",
  Education: "📚",
  Salary: "💼",
  Freelance: "💻",
  Other: "📦",
};

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note?: string;
};

export default function DashboardPage() {
  const [transactions, setTransaction] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setcategoryData] = useState<any>([]);
  const [income, setincome] = useState(0);
  const [expense, setexpense] = useState(0);
  const [total, settotal] = useState(0);

  function totalCalculation(list: Transaction[]) {
    // 👈 accept as parameter
    const incomeTransaction = list.filter((f) => f.type === "income");
    const expenseTransaction = list.filter((f) => f.type === "expense");

    const income = incomeTransaction.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );
    const expenses = expenseTransaction.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    setincome(income);
    setexpense(expenses);
    settotal(income - expenses); // 👈 also fix this — was income + expense
  }

  function getCategoryData(transactions: Transaction[]) {
    const categoryMap: Record<string, number> = {};

    // only expenses make sense for spending pie chart
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (!categoryMap[t.category]) {
          categoryMap[t.category] = 0;
        }
        categoryMap[t.category] += Number(t.amount);
      });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));
  }

  function getMonthlyData(transactions: Transaction[]) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Group transactions by month
    const monthlyMap: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const month = monthNames[date.getMonth()];

      if (!monthlyMap[month]) {
        monthlyMap[month] = { income: 0, expense: 0 };
      }

      if (t.type === "income") {
        monthlyMap[month].income += Number(t.amount);
      } else {
        monthlyMap[month].expense += Number(t.amount);
      }
    });

    // Convert to array format Recharts expects
    return Object.entries(monthlyMap).map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense,
    }));
  }

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransaction(list);
    totalCalculation(list);
    setMonthlyData(getMonthlyData(list));
    setcategoryData(getCategoryData(list));
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Summary cards ── */}
      <div className={styles.summaryGrid}>
        <div className={`${styles.summaryCard} ${styles.balanceCard}`}>
          <p className={styles.summaryLabel}>Total Balance</p>
          <p className={styles.balanceAmount}>${total}</p>
          <p className={styles.balanceSub}>Updated just now</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardTop}>
            <p className={styles.summaryLabel}>Total Income</p>
            <span className={styles.summaryIcon}>💰</span>
          </div>
          <p className={`${styles.summaryAmount} ${styles.income}`}>
            ${income}
          </p>
          <p className={styles.summaryChange}>This month</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardTop}>
            <p className={styles.summaryLabel}>Total Expenses</p>
            <span className={styles.summaryIcon}>💸</span>
          </div>
          <p className={`${styles.summaryAmount} ${styles.expense}`}>
            ${expense}
          </p>
          <p className={styles.summaryChange}>This month</p>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryCardTop}>
            <p className={styles.summaryLabel}>Transactions</p>
            <span className={styles.summaryIcon}>📊</span>
          </div>
          <p className={styles.summaryAmount}>{transactions.length}</p>
          <p className={styles.summaryChange}>Total records</p>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className={styles.chartsRow}>
        {/* Monthly bar chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Monthly Overview</h3>
            <p className={styles.chartSub}>Income vs Expenses</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={16} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #f1f5f9",
                  fontSize: "12px",
                }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar
                dataKey="income"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Expense"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Spending by Category</h3>
            <p className={styles.chartSub}>Where your money goes</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #f1f5f9",
                  fontSize: "12px",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Recent transactions ── */}
      <div className={styles.recentCard}>
        <div className={styles.recentHeader}>
          <div>
            <h3 className={styles.chartTitle}>Recent Transactions</h3>
            <p className={styles.chartSub}>Your last 5 activities</p>
          </div>
          <Link href="/transactions" className={styles.viewAll}>
            View all →
          </Link>
        </div>

        <div className={styles.recentList}>
          {transactions.map((t) => (
            <div key={t.id} className={styles.recentItem}>
              <div
                className={`${styles.icon} ${t.type === "income" ? styles.iconIncome : styles.iconExpense}`}
              >
                {categoryIcons[t.category] ?? "📦"}
              </div>
              <div className={styles.recentInfo}>
                <p className={styles.recentTitle}>{t.title}</p>
                <p className={styles.recentMeta}>
                  {t.category} ·{" "}
                  {new Date(t.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p
                className={`${styles.recentAmount} ${t.type === "income" ? styles.income : styles.expense}`}
              >
                {t.type === "income" ? "+" : "-"}${Number(t.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
