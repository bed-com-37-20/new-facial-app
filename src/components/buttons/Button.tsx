import { Button, IconAddCircle24 } from "@dhis2/ui";
import { InfoOutlined } from "@material-ui/icons";
import React from "react";

function SimpleButtons(): React.ReactElement {
  return (
    <div className="d-flex justify-content-between">
      <Button icon={<IconAddCircle24 />}>Enrol single student</Button>
      <Button icon={<InfoOutlined />}>Simple button</Button>
      <Button primary>Simple button</Button>
      <Button icon={<InfoOutlined />} destructive>
        Simple button
      </Button>
      <Button icon={<InfoOutlined />} disabled>
        Simple button
      </Button>
    </div>
  );
}

export default SimpleButtons;
