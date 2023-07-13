import React from "react";
import {
  Button,
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  ButtonStrip
} from "@dhis2/ui";

interface ModalProps {
  open: boolean
  setOpen: (value: boolean) => void
}

function ModalComponent({ open, setOpen }: ModalProps): React.ReactElement {
  return (
    <Modal
      large
      open={open}
      position={"middle"}
      onClose={() => {
        setOpen(false);
      }}
    >
      <ModalTitle>Single Student Enrollment</ModalTitle>
      <ModalContent>Modal Content</ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button
            secondary
            name="hide-modal"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            primary
            name="insert-preset"
            onClick={() => {
              setOpen(false);
            }}
          >
            Save and add new
          </Button>
          <Button
            primary
            name="insert-preset"
            onClick={() => {
              setOpen(false);
            }}
          >
            Save and close
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}

export default ModalComponent;
