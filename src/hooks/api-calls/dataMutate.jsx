import { useDataQuery } from '@dhis2/app-runtime';
import { useDataMutation } from '@dhis2/app-runtime';

const dhis2Auth = {
    username: 'admin',
    password: 'district',
};
const BASE_URL = 'http://localhost:8081/api';


const useFetchEvents = (programId) => {
    const query = {
        events: {
            resource: 'events',
            params: ({ program }) => ({
                program,
                pageSize: 1000, // Adjust as needed
            }),
        },
    };

    const { loading, error, data, refetch } = useDataQuery(query, {
        variables: { program: programId },
        lazy: true, // Fetch only when explicitly triggered
    });

    const fetchEvents = () => {
        refetch({ program: programId });
    };

    return {
        loading,
        error,
        events: data?.events?.events || [],
        fetchEvents,
    };
};


export { useFetchEvents };


// registerEvent.js

// export const registerEvent = async ({
//     trackedEntityInstance,
//     program,
//     orgUnit,
//     programStage,
//     attendance,
//     startTime,
//     endTime,
//     date,
//     courseName,
//     examRoom,
//     supervisor,
// }, dhis2BaseUrl, dhis2Auth) => {
//     const payload = {
//         trackedEntityInstance,
//         program,
//         orgUnit,
//         programStage,
//         eventDate: date,
//         status: 'ACTIVE',
//         dataValues: [
//             { dataElement: 'xIgmOIGKlkr', value: attendance },
//             { dataElement: 'ZCvzGgOWhpD', value: startTime },
//             { dataElement: 'wS32daZ8JYx', value: endTime },
//             { dataElement: 'Tak38cNTsWA', value: courseName },
//             { dataElement: 'ABcXlR45qPt', value: examRoom },
//             { dataElement: 'uK7gdfDsLPx', value: supervisor },
//             { dataElement: 'sV4hJkorxay', value: date },
//         ],
//     };

//     try {
//         const response = await fetch(`${dhis2BaseUrl}/api/events`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Basic ${btoa(dhis2Auth.username + ':' + dhis2Auth.password)}`,  // or use your token
//             },
//             body: JSON.stringify(payload),
//         });

//         const contentType = response.headers.get('content-type');
//         let result;
//         if (contentType && contentType.includes('application/json')) {
//             result = await response.json();
//         } else {
//             const text = await response.text(); // fallback for HTML or plain text
//             throw new Error(`Non-JSON response: ${text}`);
//         }
//         if (!response.ok) {
//             throw new Error(result.message || 'Failed to register event');
//         }

//         return { success: true, data: result };
//     } catch (error) {
//         console.error('Event registration failed:', error);
//         return { success: false, error };
//     }
// };

// // Example usage of the useRegisterEvent hook



// export const handleRegisterEvent = async () => {
//     const eventData = {
//         trackedEntityInstance: 'xSc9s8GIusT',
//         program: 'TLvAWiCKRgq',
//         orgUnit: 'T23eGPkA0nc',
//         programStage: 'NBb042XSt4E',
//         attendance: 'present',
//         startTime: '10:00 AM',
//         endTime: '12:00 PM',
//         date: '2023-10-01',
//         courseName: 'COM 211',
//         examRoom: 'Room A',
//         supervisor: 'Mark Johnson',
//     };

//     const result = await registerEvent(eventData, BASE_URL, dhis2Auth);

//     if (result.success) {
//         console.log('Event registered successfully:', result.data);
//     } else {
//         console.error('Failed to register event:', result.error);
//     }
// };

//import { useDataMutation } from '@dhis2/app-runtime'

const useRegisterEvent = () => {
    const eventMutation = {
        resource: 'events',
        type: 'create',
        data: ({
            trackedEntityInstance,
            program,
            orgUnit,
            programStage,
            attendance,
            startTime,
            endTime,
            date,
            courseName,
            examRoom,
            supervisor
        }) => ({
            trackedEntityInstance,
            program,
            orgUnit,
            programStage,
            eventDate: date,
            status: 'ACTIVE',
            dataValues: [
                { dataElement: 'xIgmOIGKlkr', value: attendance },
                { dataElement: 'Y8OffB2dTsL', value: startTime },
                { dataElement: 'FnpXlAn2N2t', value: endTime },
                { dataElement: 'Tak38cNTsWA', value: courseName },
                { dataElement: 'WfnwfR1lUya', value: examRoom },
                { dataElement: 'MQkz7DRBsJ0', value: supervisor },
                { dataElement: 'sV4hJkorxay', value: date },
            ],
        })
    }

    const [mutate, { loading, error, data }] = useDataMutation(eventMutation)

    const registerEvent = async (eventData) => {
        try {
            const result = await mutate(eventData)
            return { success: true, data: result }
        } catch (error) {
            console.error('Event registration failed:', error)
            return { success: false, error }
        }
    }

    return {
        registerEvent,
        loading,
        error,
        data
    }
}
export default useRegisterEvent;
// Example usage in a component
