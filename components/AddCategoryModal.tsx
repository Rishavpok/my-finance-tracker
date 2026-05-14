"use client";

import { useState } from "react";
import styles from "./modal.module.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createCategory } from "@/app/services/categories.service";

export default function AddCategoryModal({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  type CategoryForm = {
    icon: string;
    name: string;
    amount: number;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryForm>();

  async function addCategory(data: CategoryForm) {
    setIsLoading(true);
    try {
      let cat = {
        name : data.name,
        icon : data.icon,
        budget: data.amount ? Number(data.amount) : null
      };
      const res = await createCategory(cat);
      if (res) {
        onClose();
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }

    // const list = JSON.parse(localStorage.getItem("categories") || "[]");
    // const updated = [...list, data];
    // localStorage.setItem("categories", JSON.stringify(updated));
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* ── Header ── */}
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Add Category</h3>
            <p className={styles.subtitle}>Create a new spending category</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* ── Form ── */}

        <form onSubmit={handleSubmit(addCategory)}>
          <div className={styles.form}>
            {/* Icon + Name row */}
            <div className={styles.row}>
              <div className={styles.field} style={{ flex: "0 0 80px" }}>
                <label className={styles.label}>Icon</label>
                <input
                  {...register("icon")}
                  type="text"
                  placeholder="🍔"
                  maxLength={2}
                  className={`${styles.input} ${styles.iconInput}`}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Category name</label>
                <input
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  type="text"
                  placeholder="e.g. Food & Dining"
                  className={styles.input}
                />
                {errors.name && (
                  <span className={styles.error}>{errors.name.message}</span>
                )}
              </div>
            </div>

            {/* Budget */}
            <div className={styles.field}>
              <label className={styles.label}>
                Monthly budget
                <span className={styles.optional}>optional</span>
              </label>
              <div className={styles.amountWrapper}>
                <span className={styles.currency}>$</span>
                <input
                  {...register("amount")}
                  type="number"
                  placeholder="0.00"
                  className={`${styles.input} ${styles.amountInput}`}
                />
              </div>
              <p className={styles.fieldHint}>
                Set a limit to track overspending
              </p>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className={styles.actions}>
            <button onClick={onClose} className={styles.btnSecondary}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
