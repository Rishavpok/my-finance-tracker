"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategory } from "@/app/services/categories.service";
import {
  createTransaction,
  getTransactionsById,
  updateTransaction,
} from "@/app/services/transaction.service";
import toast from "react-hot-toast";

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
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionForm>();

  async function addTransaction(data: TransactionForm) {
    setIsLoading(true);
    try {
      const transaction = {
        ...data,
        type: activeIndex === 0 ? "expense" : "income",
      };
     const res = await (id ? updateTransaction(transaction, id!) : createTransaction(transaction));

      if (res) {
        toast.success("Transaction added successfully");
      }

      router.push("/transactions");
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function getCategories() {
    const res = await getCategory();
    setcategories(res["data"]["data"]);
  }

  async function getSingleTransaction(id: string) {
    const res = await getTransactionsById(id);
    const transaction = res['data']['transaction']
    if (transaction) {
  reset({
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date.split("T")[0],  // "2026-05-15"
      note: transaction.note ?? "",
    });
    setactiveIndex(transaction.type === "income" ? 1 : 0);
    }
  }

useEffect(() => {
  async function init() {
    await getCategories(); // wait for categories to load first
    if (id) {
      await getSingleTransaction(id); // then prefill form
    }
  }
  init();
}, []); // single effect, correct order

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
              <span className={styles.currency}>Rs </span>
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

              {
                categories.length === 0 ? <p className={styles.createcategory} >Please create a category first</p>: ""
              }
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
            <button
              type="submit"
              disabled={isLoading}
              className={styles.btnPrimary}
            >
              {!id ? "Save Transaction" : "Update Transaction"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
