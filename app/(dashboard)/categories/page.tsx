"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import AddCategoryModal from "@/components/AddCategoryModal";

type category = {
  icon : string,
  name : string,
  amount : string
}

export default function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<category[]>([]);

  function deleteCategory(name:string) {
    const list = JSON.parse(localStorage.getItem("categories") || "[]");
    const filtered = list.filter((t : category) => t.name !== name  )
    localStorage.setItem("categories" , JSON.stringify(filtered))

    setCategories(filtered)
  }

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("categories") || "[]");
    setCategories(list);
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Categories</h2>
          <p className={styles.subtitle}>
            Track spending across all your categories
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className={styles.addBtn}
        >
          + Add Category
        </button>
      </div>

      {showModal && <AddCategoryModal onClose={() => setShowModal(false)} />}

      {/* ── Summary strip ── */}
      <div className={styles.summaryStrip}>
        <div className={styles.stripItem}>
          <p className={styles.stripNum}>{categories?.length}</p>
          <p className={styles.stripLabel}>Total Categories</p>
        </div>
      </div>

      {/* ── Categories grid ── */}
      <div className={styles.grid}>
        {categories &&
          categories.map((cat) => {
            return (
              <div key={cat.name} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.iconWrapper}>
                    <span className={styles.icon}>{cat.icon}</span>
                  </div>
                  <button type="button" onClick={() => deleteCategory(cat.name)} className={styles.deleteBtn}>🗑️</button>
                </div>

                {/* Add these two lines */}
                <p className={styles.catName}>{cat.name}</p>
                <p className={styles.catTransactions}>${cat.amount || 0}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
