import React from "react";
import styles from "./loading.module.css";

export default function GlobalLoading() {
  return (
    <div className={styles.loadingRoot}>
      <div className={styles.spinner}></div>
      <div className={styles.text}>Caricamento in corso...<br/>Prepara la moka ☕</div>
    </div>
  );
}
