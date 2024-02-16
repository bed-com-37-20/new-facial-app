interface defaults {
    currentAcademicYear: string
}

interface dataStoreRecord {
    key: string
    defaults: defaults 


}

export type { dataStoreRecord }