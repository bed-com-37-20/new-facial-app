import { SplitButton } from "@dhis2/ui";
import React from "react";
import FlyoutMenuComponent from "../menu/FlyoutMenu.js";
import { enrollmentOptions } from "./options.js";

interface ButtonProps {
  name: string
  icon?: React.ReactNode
}
function DropdownButtonComponent(props: ButtonProps): React.ReactElement {
  const { name, icon } = props;

  return (
    <SplitButton
      icon={icon}
      component={<FlyoutMenuComponent options={enrollmentOptions} />}
    >
      {name}
    </SplitButton>
  );
}

export default DropdownButtonComponent;
