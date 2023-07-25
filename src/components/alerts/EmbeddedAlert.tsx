import React from "react";
import { Tag } from "@dhis2/ui";
import styles from "./tag.module.css";

interface TagProps {
  text: string
  icon?: React.ReactNode
  neutral?: boolean
  positive?: boolean
  negative?: boolean
  bold?: boolean
}

export default function TagAlert(props: TagProps): React.ReactElement {
    const { text, icon } = props;
  return (
    <Tag icon={icon} className={styles.tagAlert} {...props}>
      {text}
    </Tag>
  );
}
