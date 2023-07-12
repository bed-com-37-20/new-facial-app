import { Button, IconAddCircle24, IconUserGroup16 } from "@dhis2/ui";
import React from "react";
// eslint-disable-next-line import/extensions
import { DropdownButtonComponent } from "../../components";
import { enrollmentOptions } from "../../components/buttons/options";

function DropdownButton(): React.ReactElement {
  return (
    <div>
      <Button name="Basic button" value="default" className="mr-3" icon={<IconAddCircle24 />}>
        Enrol single student
      </Button>
      <DropdownButtonComponent
        name="Bulk enrollment"
        icon={<IconUserGroup16 />}
        options={enrollmentOptions}
      />
    </div>
  );
}

export default DropdownButton;
