import React from "react";
// eslint-disable-next-line import/extensions
import { InfoOutlined } from "@material-ui/icons";
import { ButtonComponent } from "../../components";

const typesButtons = [
  {
    name: "Primary Button",
    primary: "primary",
    icon: <InfoOutlined/>
  },
  {
    name: "Success Button",
    success: "success"
  },
  {
    name: "Error Button",
    error: "error"
  },
  {
    name: "Secondary Button",
    secondary: "secondary"
  },
  {
    name: "Info Button",
    info: "info"
  },
  {
    name: "Dark Button",
    dark: "dark"
  }
];

function Button(): React.ReactElement {
  return (
    <div>
      <div className="d-flex">
        {typesButtons.map((x, i) => (
          <div key={i} className="flex-grow">
            <ButtonComponent key={x.name} {...x} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Button;
