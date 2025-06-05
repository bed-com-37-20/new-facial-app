import { getSelectedKey } from "./getSelectedKey";
export const getDataStoreKeys = () => {
  const {
    key,
    defaults
  } = getSelectedKey().getDataStoreData;
  return {
    dataStoreKey: key,
    currentAcademicYear: defaults === null || defaults === void 0 ? void 0 : defaults.currentAcademicYear
  };
};