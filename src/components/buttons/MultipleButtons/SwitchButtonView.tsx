import React, { useState, useEffect } from "react";
import SimpleDropdownButton from "./SimpleDropdownButton";
import SimpleButton from "./SimpleButton";
import { Button, IconAdd16, IconSubtract16, ButtonStrip } from "@dhis2/ui"
import { type SimpleButtonsProps } from "../../../types/Buttons/SimpleButtonsProps";

const initialItems: SimpleButtonsProps[] = [
  { id: "item1", label: "Item 1" },
  { id: "item2", label: "Item 2" },
  { id: "item3", label: "Item 3" }
];

export default function SwitchButtonView(): React.ReactElement {
  const [items, setItems] = useState<SimpleButtonsProps[]>(initialItems)
  const [selectedTerm, setSelectedTerm] = useState<SimpleButtonsProps>();

  useEffect(() => {
    if ((selectedTerm != null) && !items.some(item => item.id === selectedTerm?.id)) setSelectedTerm(items[items.length - 1]);
  }, [items]);

  return (
    <div>
      <ButtonStrip>
        <Button disabled={items.length === 1} icon={<IconSubtract16 />} onClick={removeItem}>Less items</Button>
        <Button icon={<IconAdd16 />} onClick={addItem}>More items</Button>
      </ButtonStrip>
      <br />

      <label className="text-danger">{`${items.length} items`}</label> <br />
      {items.length > 3
       ? <SimpleDropdownButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
       : <SimpleButton items={items} selectedTerm={selectedTerm} setSelectedTerm={setSelectedTerm} />
      }
    </div>
  );

  /* Helper functions to illustrate component behavior */
  function addItem() {
    const newItem = {
      id: `item${items.length + 1}`,
      label: `Item ${items.length + 1}`
    };
    const newItems = [...items, newItem];
    setItems(newItems);
  }

  function removeItem() {
    const newItems = items.slice(0, items.length - 1);
    setItems(newItems);
  }
}
