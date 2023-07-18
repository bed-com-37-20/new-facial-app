import React, { useState } from "react";
import { DropdownButton, FlyoutMenu, MenuItem } from "@dhis2/ui";
import styles from "../button.module.css"

export default function SimpleDropdownButton(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTerm, setSelectedTerm] = useState<string>();
  const items = [
    { id: "Term1", label: "Term 1" },
    { id: "Term2", label: "Term 2" },
    { id: "Term3", label: "Term 3" },
    { id: "Term4", label: "Term 4" }
  ];
  return (
    <DropdownButton
    className={styles.simpleDropdownButton}
    onClick={() => { setOpen(true) }}
      component={ open &&
        <FlyoutMenu>
          {items.map((item) => (
            <MenuItem active={selectedTerm === item.label} onClick={() => { setSelectedTerm(item.label); setOpen(false) }} key={item.id} label={item.label} />
          ))}
        </FlyoutMenu>
      }
    >{selectedTerm ?? "Terms"}</DropdownButton>
  );
}
