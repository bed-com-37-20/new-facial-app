import React from "react";
// eslint-disable-next-line import/extensions
import { Buttons, DropdownButtonComponent, SwitchButtonView, WithPadding } from "../../components";
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
        <SwitchButtonView/>
      </ButtonStrip>
    </WithPadding>
  );
}

export default ButtonsPage;
