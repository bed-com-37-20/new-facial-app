import React from "react";
import styles from "./button.module.css";

interface CardProps {
  label: string
  value: string
  active?: string
}

export default function SimpleButton(props: CardProps): React.ReactElement {
  const { label, active } = props;
  const activeStyle: boolean = active != null ? styles[active] : "";

  return (
    <div className={activeStyle || styles.simpleButton}>
      <span className={styles.simpleButtonLabel}>{label}</span>
    </div>
  );
}
