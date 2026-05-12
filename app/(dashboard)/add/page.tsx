"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

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

type TransactionForm = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  note?: string;
};

type category = {
  icon: string;
  name: string;
};

export default function AddTransactionPage() {
  const [activeIndex, setactiveIndex] = useState(0);
  const [categories, setcategories] = useState<category[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TransactionForm>();

  function addTransaction(data: TransactionForm) {
    const transactions = JSON.parse(
      localStorage.getItem("transactions") || "[]",
    );

    if (id) {
      const updated = transactions.map((t: Transaction) =>
        t.id === id
          ? { ...t, ...data, type: activeIndex === 1 ? "income" : "expense" }
          : t,
      );
      localStorage.setItem("transactions", JSON.stringify(updated));
    } else {
      let newTransaction = {
        id: crypto.randomUUID(),
        title: data.title,
        amount: data.amount,
        category: data.category,
        type: activeIndex === 1 ? "income" : "expense",
        date: data.date,
        note: data.note,
      };

      const updated = [...transactions, newTransaction];
      localStorage.setItem("transactions", JSON.stringify(updated));
    }
    // navigate to transaction
    router.push("/transactions");
  }

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("categories") || "[]");
    setcategories(list);
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }

    const list = JSON.parse(localStorage.getItem("transactions") || "[]");
    const transaction = list.find((t: Transaction) => t.id === id);

    if (transaction) {
      setValue("title", transaction.title); // prefill form fields
      setValue("amount", transaction.amount);
      setValue("category", transaction.category);
      setValue("date", transaction.date);
      setValue("note", transaction.note);
      setactiveIndex(transaction.type === "income" ? 1 : 0);
    }
  });

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.header}>
        <h2 className={styles.title}>Add Transaction</h2>
        <p className={styles.subtitle}>Record a new income or expense</p>
      </div>

      {/* ── Form card ── */}
      <form onSubmit={handleSubmit(addTransaction)}>
        <div className={styles.card}>
          {/* Type toggle */}
          <div className={styles.field}>
            <label className={styles.label}>Transaction type</label>
            <div className={styles.toggle}>
              <button
                type="button"
                onClick={() => setactiveIndex(0)}
                className={`${styles.toggleBtn} ${activeIndex === 0 ? styles.toggleActive : ""}`}
              >
                💸 Expense
              </button>
              <button
                type="button"
                onClick={() => setactiveIndex(1)}
                className={`${styles.toggleBtn} ${activeIndex === 1 ? styles.toggleActive : ""}`}
              >
                💰 Income
              </button>
            </div>
          </div>

          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              {...register("title", {
                required: "Title is required",
              })}
              type="text"
              placeholder="e.g. Grocery shopping"
              className={styles.input}
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </div>

          {/* Amount */}
          <div className={styles.field}>
            <label className={styles.label}>Amount</label>
            <div className={styles.amountWrapper}>
              <span className={styles.currency}>$</span>
              <input
                {...register("amount", {
                  required: "Amount is required",
                })}
                type="number"
                placeholder="0.00"
                className={`${styles.input} ${styles.amountInput}`}
              />
            </div>
            {errors.amount && (
              <span className={styles.error}>{errors.amount.message}</span>
            )}
          </div>

          {/* Category + Date row */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select
                {...register("category", { required: "Category is required" })}
                className={styles.select}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {errors.category && (
                <span className={styles.error}>{errors.category.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input
                {...register("date", {
                  required: "Date is required",
                })}
                type="date"
                className={styles.input}
              />
              {errors.date && (
                <span className={styles.error}>{errors.date.message}</span>
              )}
            </div>
          </div>

          {/* Note */}
          <div className={styles.field}>
            <label className={styles.label}>
              Note
              <span className={styles.optional}>optional</span>
            </label>
            <textarea
              {...register("note")}
              placeholder="Add a short note..."
              rows={3}
              className={styles.textarea}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => router.push("/transactions")}
              className={styles.btnSecondary}
            >
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              {!id ? "Save Transaction" : "Update Transaction"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
