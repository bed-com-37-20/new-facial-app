import React from "react";
// eslint-disable-next-line import/extensions
import { SimpleButtons, DropdownButtonComponent } from "../../components";
import { IconUserGroup16 } from "@dhis2/ui";
import { enrollmentOptions } from "../../components/buttons/options";

function Button(): React.ReactElement {
  return (
    <div>
      <SimpleButtons />
      <br />
      <DropdownButtonComponent
        name="Bulk enrollment"
        icon={<IconUserGroup16 />}
        options={enrollmentOptions}
      />
    </div>
  );
}

export default Button;
