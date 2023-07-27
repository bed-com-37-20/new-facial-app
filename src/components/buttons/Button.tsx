import React from "react";
import { Button, ButtonStrip, IconAddCircle24, IconInfo24 } from "@dhis2/ui";

function Buttons(): React.ReactElement {
  return (
    <ButtonStrip>
      <Button icon={<IconAddCircle24 />}>Enrol single student</Button>
      <Button>Simple button</Button>
      <Button primary>Simple button</Button>
      <Button icon={<IconInfo24 />} destructive>
        Simple button
      </Button>
      <Button icon={<IconInfo24 />} disabled>
        Simple button
      </Button>
    </ButtonStrip>
  );
}

export default Buttons;
