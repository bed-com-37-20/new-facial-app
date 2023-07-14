import React from "react";
import { Divider, Box, Label, InputField, Button, ButtonStrip } from "@dhis2/ui";
import WithPadding from "../template/WithPadding";
import styles from "./modal.module.css";
import { Col, Row } from "react-bootstrap";

interface ModalProps {
  setOpen: (value: boolean) => void
}

function ModalContentComponent({ setOpen }: ModalProps): React.ReactElement {
  const formFields = [
    {
      section: "Enrollment Details",
      description: "Details related to the enrollment process",
      fields: [
        {
          label: "Registering School",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Academic Year",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Grade",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Class",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Enrollment Date",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        }
      ]
    },
    {
      section: "Student profile",
      description: "Student personal details",
      fields: [
        {
          label: "Student National ID",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Class Order",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "First Name",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Surname",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Sex",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Date of Birth",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        }
      ]
    },
    {
      section: "Socio-economic details",
      description: "Details about the student socio-economic status",
      fields: [
        {
          label: "Special needs?",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Health Issues?",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        },
        {
          label: "Pratical Skills?",
          attribute: "fieldId",
          valueType: "text",
          placeholder: "Registering",
          disabled: false
        }
      ]
    }
  ];
  return (
    <>
      {formFields.map((ff, i) => (
        <WithPadding key={i}>
          <h6 className={styles.subTitle}>{ff.section}</h6>
          <WithPadding />
          <Label>{ff.description}</Label>
          <WithPadding p="0.2rem" />
          <Box width="100%">
            {ff.fields.map((field, f) => (
              <Row className={styles.formSection} key={f}>
                <Col sm={5}>
                  <Label>{field.label}</Label>
                </Col>
                <Col sm={7}>
                  <InputField disabled={field.disabled} name={field.attribute} placeholder={field.label} />
                </Col>
              </Row>
            ))}
            <Divider />
          </Box>
        </WithPadding>
      ))}
      <ButtonStrip end className="mr-4">
          <Button
            secondary
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            primary
            onClick={() => {
              setOpen(false);
            }}
          >
            Save and add new
          </Button>
          <Button
            primary
            onClick={() => {
              setOpen(false);
            }}
          >
            Save and close
          </Button>
        </ButtonStrip>
    </>
  );
}

export default ModalContentComponent;
