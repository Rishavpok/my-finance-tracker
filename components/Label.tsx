import styles from "./Label.module.css";

export default function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor}  className={styles.label}>
      {children}
    </label>
  );
}