"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { singUp } from "@/app/services/auth.service";
import { useState } from "react";
import toast from "react-hot-toast";

type registrationForm = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export default function Registration() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<registrationForm>();

  const password = watch("password");

  async function handleRegistration(data: registrationForm) {
    setisLoading(true);
    try {
      let user = {
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
        email: data.email,
      };
      const res = await singUp(user);
      if (res) {
        toast.success("User registered successfully !");
        router.push("/login");
      }
    } catch (e) {
      toast.error("Something went wrong !");
    } finally {
      setisLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.logo}>💰 FinTrack</span>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit(handleRegistration)}>
          <div className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>First name</label>
              <input
                {...register("first_name", {
                  required: "First name is required",
                })}
                type="text"
                placeholder="John"
                className={styles.input}
              />
              {errors.first_name && (
                <span className={styles.error}>
                  {errors.first_name.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Last name</label>
              <input
                {...register("last_name", {
                  required: "Last name is required",
                })}
                type="text"
                placeholder="Doe"
                className={styles.input}
              />
              {errors.last_name && (
                <span className={styles.error}>{errors.last_name.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                type="email"
                placeholder="john@example.com"
                className={styles.input}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
              </div>
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                type="password"
                placeholder="••••••••"
                className={styles.input}
              />
              {errors.password && (
                <span className={styles.error}>{errors.password.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Confirm Password</label>
              </div>
              <input
                {...register("confirm_password", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                placeholder="••••••••"
                className={styles.input}
              />
              {errors.confirm_password && (
                <span className={styles.error}>
                  {errors.confirm_password.message}
                </span>
              )}
            </div>

            <button disabled={isLoading} className={styles.btnPrimary}>
              {isLoading ? "..." : "Sign up"}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>or</span>
              <span className={styles.dividerLine} />
            </div>
          </div>
        </form>

        <p className={styles.signup}>
          Already have an account?{" "}
          <Link href="/login" className={styles.signupLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
