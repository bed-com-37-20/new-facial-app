import React from "react";
import styles from "./text.module.css";
import { SubtitleProps } from "../../types/common/components";

function Subtitle(props: SubtitleProps): React.ReactElement {
  const { label } = props;

  return <h6 className={styles.subTitle}>{label}</h6>;
}

export default Subtitle;
