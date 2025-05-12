import { getSelectedKey } from "./getSelectedKey";


export const getDataStoreKeys =() => {
    const { key, defaults } = getSelectedKey().getDataStoreData;
    
    return {
        dataStoreKey: key,
        currentAcademicYear: defaults?.currentAcademicYear
    }
};