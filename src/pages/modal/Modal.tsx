import React, { useState } from "react";
// eslint-disable-next-line import/extensions
import { IconAddCircle24, Button } from "@dhis2/ui";
import { ModalComponent, ModalContentComponent, WithPadding } from "../../components";

function Modal(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <WithPadding>
      <Button icon={<IconAddCircle24 />} onClick={() => { setOpen(true); }}>Open Modal</Button>

      {open && <ModalComponent title="Single Student Enrollment" open={open} setOpen={setOpen}><ModalContentComponent setOpen={setOpen}/></ModalComponent>}
    </WithPadding>
  );
}

export default Modal;
