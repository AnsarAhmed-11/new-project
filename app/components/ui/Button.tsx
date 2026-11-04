import type { ButtonHTMLAttributes } from "react";
import styles from "@/app/styles/components/ui/Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost"; size?: "default" | "sm" | "lg" };

export function Button({ className = "", variant = "default", size = "default", ...props }: ButtonProps) {
  return <button className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`} {...props} />;
}
