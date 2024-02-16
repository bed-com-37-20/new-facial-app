import { useRecoilValue } from "recoil";
import { DataStoreState } from "../../../schema/dataStoreSchema"
import { dataStoreRecord } from "../../../types/dataStore/DataStoreConfig";

export const getSelectedKey = () => {
    const emisConfig = useRecoilValue(DataStoreState);

    const getDataStoreData: dataStoreRecord = emisConfig?.length > 0 ? emisConfig[0] ?? {} as unknown as dataStoreRecord : {} as unknown as dataStoreRecord

    return { getDataStoreData }
}
