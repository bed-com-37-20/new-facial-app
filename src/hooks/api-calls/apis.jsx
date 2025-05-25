import { useDataQuery, useDataMutation } from '@dhis2/app-runtime';
// import { useDataMutation } from '@dhis2/app-runtime';


export const useFetchOrganisationUnits = () => {
    const query = {
        organisationUnits: {
            resource: 'organisationUnits',
            params: {
                fields: 'id,displayName,path',
                paging: 'false',
            },
        },
    };

    const { loading, error, data } = useDataQuery(query);

    return {
        loading,
        error,
        organisationUnits: data?.organisationUnits?.organisationUnits || [],
    };
};

export const useFetchPrograms = () => {
    const query = {
        programs: {
            resource: 'programs',
            params: {
                fields: 'id,displayName,programType',
                paging: 'false',
            },
        },
    };

    const { loading, error, data } = useDataQuery(query);

    return {
        loading,
        error,
        programs: data?.programs?.programs || [],
    };
};

export const useEnrollStudent = () => {
     
    const teiMutation = {
        type: 'create',
        resource: 'trackedEntityInstances',
        data: ({ trackedEntityTypeId, orgUnitId, attributes }) => ({
            trackedEntityType: trackedEntityTypeId,
            orgUnit: orgUnitId,
            attributes,
        }),
    };

    const enrollmentMutation = {
        type: 'create',
        resource: 'enrollments',
        data: ({ studentId, programId, orgUnitId, enrollmentDate, incidentDate }) => ({
            trackedEntityInstance: studentId,
            program: programId,
            orgUnit: orgUnitId,
            enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
            incidentDate: incidentDate || new Date().toISOString().split('T')[0],
        }),
    };

    const [createTEI] = useDataMutation(teiMutation);
    //const [enrollTEI, { loading, error }] = useDataMutation(enrollmentMutation);
    const { enrollTEI, loadingEnrol, errorEnrol } = useDataMutation(enrollmentMutation);

    /**
     * Enroll a student by first creating the TEI, then enrolling into the program.
     * 
     * @param {string} trackedEntityTypeId - UID of the tracked entity type
     * @param {string} programId - UID of the tracker program
     * @param {string} orgUnitId - UID of the org unit
     * @param {FormData} formData - FormData object with student values
     */
    const enrollStudent = (trackedEntityTypeId, programId, orgUnitId, formData) => {
        
        const attributes = [
            { attribute: "ct4z0T1F36i", value: formData.school },
            { attribute: "aqBmqM1onC7", value: formData.academicYear },
            { attribute: "EHTfWCHTYCo", value: formData.yearOfStudy },
            { attribute: "ADiCfoRxZI2", value: formData.programOfStudy},
            { attribute: "ixauprApakv", value: formData.enrollmentDate },
            // { attribute: "ED1V1bFMtb1", value: formData.profilePicture },
            { attribute: "nlAAn9uTTie", value: formData.firstName },
            { attribute: "KHFDJkJgUvj", value: formData.surname },
            { attribute: "Cg56JK84NAd", value: formData.gender},
            { attribute: "EAPD9u4neIp", value: formData.dateOfBirth },
            { attribute: "hhyS9WANpuz", value: formData.nationality },
            { attribute: "pzZJIX2yMEZ", value: formData.guardianName },
            { attribute: "ofiRHvsg4Mt", value: formData.regNumber},
        ];

        createTEI({ trackedEntityTypeId, orgUnitId, attributes }, {
            onComplete: ({ response }) => {
                const studentId = response.reference;
                enrollTEI({ studentId, programId, orgUnitId });
            },
        });
    };

    return {
        enrollStudent,
        loadingEnrol,
        errorEnrol,
    };
};

export const useEnrolledStudents = (programId, orgUnitId) => {
    const query = {
        students: {
            resource: 'trackedEntityInstances',
            params: {
                ou: orgUnitId,
                paging: false,
            },
        },
    };

    const { data, loaddata, errordata, refetch } = useDataQuery(query);

    return {
        students: data?.students?.trackedEntityInstances || [],
        loaddata,
        errordata,
        refetch,
    };
};
