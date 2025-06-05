import { useRecoilValue } from "recoil";
import { DataStoreState } from "../../../schema/dataStoreSchema";
export const getSelectedKey = () => {
  var _emisConfig$;
  const emisConfig = useRecoilValue(DataStoreState);
  const getDataStoreData = (emisConfig === null || emisConfig === void 0 ? void 0 : emisConfig.length) > 0 ? (_emisConfig$ = emisConfig[0]) !== null && _emisConfig$ !== void 0 ? _emisConfig$ : {} : {};
  return {
    getDataStoreData
  };
};