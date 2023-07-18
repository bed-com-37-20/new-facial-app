import React from "react";
// eslint-disable-next-line import/extensions
import { Buttons, DropdownButtonComponent, SimpleButton, SimpleDropdownButton, WithPadding } from "../../components";
import { IconUserGroup16, IconAddCircle24, Button, ButtonStrip } from "@dhis2/ui";
import { enrollmentOptions } from "../../components/buttons/options";

function ButtonsPage(): React.ReactElement {
  return (
    <WithPadding>
      <Buttons />
      <br />
      <ButtonStrip>
        <Button icon={<IconAddCircle24 />}>Enrol single student</Button>
        <DropdownButtonComponent
          name="Bulk enrollment"
          icon={<IconUserGroup16 />}
          options={enrollmentOptions}
        />
      </ButtonStrip>
      <br />

      <ButtonStrip>
        <SimpleButton label="Term 1" value="Term 1"/>
        <SimpleButton label="Term 2" value="Term 2" active="active-button"/>
        <SimpleDropdownButton/>
      </ButtonStrip>
    </WithPadding>
  );
}

export default ButtonsPage;
