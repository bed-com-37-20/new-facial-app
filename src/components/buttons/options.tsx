
import { type FlyoutOptionsProps } from "../../types/Buttons/FlyoutOptions";

const enrollmentOptions: FlyoutOptionsProps[] = [
    { label: "Import students", divider: true, action: () => null },
    { label: "Export empty template", divider: false, action: () => null },
    { label: "Export template with data", divider: false, action: () => null }
  ];

export { enrollmentOptions };
