import { useDataQuery, useDataEngine } from '@dhis2/app-runtime';


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

export const useEnrolledStudents = (programId, orgUnitId) => {
    const engine = useDataEngine()

    const fetchStudents = async () => {
        try {
            const { students } = await engine.query({
                students: {
                    resource: 'trackedEntityInstances',
                    params: {
                        ou: orgUnitId,
                        program: programId,
                        paging: false,
                    },
                },
            });

            return students.trackedEntityInstances || [];
        } catch (error) {
            console.error('Error fetching enrolled students:', error);
            return [];
        }
    };

    return {
        fetchStudents,
    };
};


export async function registerAndEnrollStudent(formData, programId, orgUnitId, trackedEntityTypeId) {
    const AUTH = 'Basic ' + btoa('admin:district');
    const BASE_URL = 'http://localhost:8080/api';

    // 1. Prepare the student registration data
    
    const registrationPayload = {
        trackedEntityType: trackedEntityTypeId,
        orgUnit: orgUnitId,
        attributes: [
            { attribute: "jVcE7zcVq9i", value: formData.school },
            { attribute: "sdV0Qc0puZX", value: formData.academicYear },
            { attribute: "dA6No4FoYxI", value: formData.yearOfStudy },
            { attribute: "ctwU8hvnyk9", value: formData.programOfStudy },
            { attribute: "FtBP3ctaOfX", value: formData.enrollmentDate },
            { attribute: "AAhQa2QBdLb", value: formData.firstName },
            { attribute: "jcNk3WUk6CF", value: formData.surname },
            { attribute: "N6NvXcYsRp8", value: formData.gender },
            { attribute: "tzLYzIpqGiB", value: formData.dateOfBirth },
            { attribute: "DicIdiy94P8", value: formData.nationality },
            { attribute: "Es03r1AMOwQ", value: formData.guardianName },
            { attribute: "oU3liZI9qx6", value: formData.regNumber },
        ]
    };

    try {
        // 2. Register the student (create Tracked Entity Instance)
        const registrationResponse = await fetch(`${BASE_URL}/trackedEntityInstances`, {
            method: 'POST',
            headers: {
                'Authorization': AUTH,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationPayload)
        });

        if (!registrationResponse.ok) {
            console.log(registrationResponse)
            const errorData = await registrationResponse.json();
            throw new Error(`Registration failed: ${JSON.stringify(errorData)}`);
        }

        const registrationResult = await registrationResponse.json();
        //console.log('Registration response:', registrationResult);
        const trackedEntityInstanceId = registrationResult.response.importSummaries[0].reference;

        if (!trackedEntityInstanceId) {
            throw new Error('Could not get Tracked Entity Instance ID from registration response');
        }

        console.log('Registration successful. TEI ID:', trackedEntityInstanceId);

       // 3. Prepare enrollment payload
        const enrollmentPayload = {
            trackedEntityInstance: trackedEntityInstanceId,
            program: programId,
            orgUnit: orgUnitId,
            enrollmentDate: formData.enrollmentDate || new Date().toISOString().split('T')[0],
            incidentDate: formData.enrollmentDate || new Date().toISOString().split('T')[0]
        };

        // 4. Enroll the student in the program
        const enrollmentResponse = await fetch(`${BASE_URL}/enrollments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH
            },
            body: JSON.stringify(enrollmentPayload)
        });

        if (!enrollmentResponse.ok) {
            const errorData = await enrollmentResponse.json();
            console.log('Enrollment failed:', errorData);
            // throw new Error(`Enrollment failed: ${JSON.stringify(errorData)}`);
        }

        const enrollmentResult = await enrollmentResponse.json();
        console.log('Enrollment successful:', enrollmentResult);

        return {
            success: true,
            // "rlYmuNFO06q"
            trackedEntityInstanceId,
            enrollmentId: enrollmentResult.response.imported || enrollmentResult.response.reference,
            registrationResponse: registrationResult,
            enrollmentResponse: enrollmentResult
        };

    } catch (error) {
        console.error('Error in registerAndEnrollStudent:', error);
        return {
            success: false,
            error: error.message
        };
    }
}







