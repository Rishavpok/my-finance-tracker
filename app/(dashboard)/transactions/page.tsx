"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  deleteTransaction,
  getTransactions,
} from "@/app/services/transaction.service";
import { deleteCategory, getCategory } from "@/app/services/categories.service";

type category = {
  icon: string;
  name: string;
};

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

const categories = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Salary",
  "Freelance",
  "Other",
];

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransaction] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [categories, setcategories] = useState<category[]>([]);

  const [income, setincome] = useState(0);
  const [expense, setexpense] = useState(0);
  const [total, settotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");

  // router
  const router = useRouter();

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

  function onSearch(e: any) {
    if (e.trim() === "") {
      getTransaction();
      return;
    }

    const filtered = transactions.filter((t) =>
      t.title.toLowerCase().includes(e.toLowerCase()),
    );

    setTransaction(filtered);
  }

  function handleType(type: string) {
    if (type === "all") {
      setTransaction(allTransactions);
    } else {
      const filtered = allTransactions.filter(
        (t: Transaction) => t.type === type,
      );
      setTransaction(filtered);
    }
  }

  function handleCategoryChange(e: string) {
    if (e === "all") {
      setTransaction(allTransactions);
    } else {
      const filtered = allTransactions.filter(
        (t: Transaction) => t.category === e,
      );
      setTransaction(filtered);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await deleteTransaction(id);

      if (res) {
        toast.success("Transaction deleted successfully");
        getTransaction();
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  function handleEdit(id: string) {
    router.push(`/add?id=${id}`);
  }

  async function getTransaction() {
    try {
      const res = await getTransactions();
      setTransaction(res["data"]["data"]);
      setAllTransactions(res["data"]["data"]);
      totalCalculation(res["data"]["data"]);
      // getUniqueMonths(res["data"]["data"])
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  function handleMonthFilter(month: string) {
  setSelectedMonth(month);
  const list = allTransactions

  if (month === "") {
    setTransaction(list);
    return;
  }

  const filtered = list.filter((t: any) => {
    const date = new Date(t.date);
    const transMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return transMonth === month;
  });

  setTransaction(filtered);
}

  

  async function getCategories() {
    const res = await getCategory();
    setcategories(res["data"]["data"]);
  }

  // get unique months from transactions
  function getUniqueMonths(transactions: any[]) {
    const months = transactions.map((t) => {
      const date = new Date(t.date);
      return {
        value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
        label: date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      };
    });

    // remove duplicates
    return [...new Map(months.map((m) => [m.value, m])).values()];
  }

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getTransaction();
  }, []);
  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Transactions</h2>
          <p className={styles.subtitle}>
            All your income and expenses in one place
          </p>
        </div>
        <Link href="/add" className={styles.addBtn}>
          + Add New
        </Link>
      </div>

      {/* ── Summary cards ── */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Total Income</p>
          <p className={`${styles.summaryAmount} ${styles.income}`}>
            + ${income}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Total Expenses</p>
          <p className={`${styles.summaryAmount} ${styles.expense}`}>
            - ${expense}
          </p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Balance</p>
          <p className={`${styles.summaryAmount} ${styles.balance}`}>
            ${total}
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filters}>
        <input
          onChange={(e) => onSearch(e.target.value)}
          type="text"
          placeholder="🔍 Search transactions..."
          className={styles.searchInput}
        />
        <select
          onChange={(e) => handleType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          onChange={(e) => handleCategoryChange(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={selectedMonth}
          onChange={(e) => handleMonthFilter(e.target.value)}
        >
          <option value="">All Months</option>
          {getUniqueMonths(transactions).map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Transactions list ── */}
      <div className={styles.list}>
        {transactions.length === 0 ? <div>Transactions not found</div> : ""}
        {transactions &&
          transactions.map((t) => (
            <div key={t.id} className={styles.card}>
              {/* Icon */}
              <div
                className={`${styles.icon} ${t.type === "income" ? styles.iconIncome : styles.iconExpense}`}
              >
                {categoryIcons[t.category] ?? "📦"}
              </div>

              {/* Info */}
              <div className={styles.info}>
                <p className={styles.transTitle}>{t.title}</p>
                <div className={styles.transMeta}>
                  <span className={styles.category}>{t.category}</span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.date}>
                    {new Date(t.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {t.note && (
                    <>
                      <span className={styles.metaDot}>·</span>
                      <span className={styles.note}>{t.note}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className={styles.right}>
                <p
                  className={`${styles.amount} ${t.type === "income" ? styles.income : styles.expense}`}
                >
                  {t.type === "income" ? "+" : "-"}$
                  {Number(t.amount).toFixed(2)}
                </p>
                <span
                  className={`${styles.badge} ${t.type === "income" ? styles.badgeIncome : styles.badgeExpense}`}
                >
                  {t.type}
                </span>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={() => handleEdit(t.id)}
                  className={styles.editBtn}
                >
                  ✏️
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className={styles.deleteBtn}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
