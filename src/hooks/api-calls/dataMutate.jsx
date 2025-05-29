import { useDataQuery } from '@dhis2/app-runtime';
import { useDataMutation } from '@dhis2/app-runtime';

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


export default useFetchEvents;


const useRegisterEvent = () => {
    'FnpXlAn2N2t'
    const mutation = {
        type: 'create',
        resource: 'events',
        data: ({
            attendance,
            startTime,
            endTime,
            date,
            courseName,
            examRoom,
            supervisor,
            orgUnit,          // Required
            program,          // Required
            programStage      // Required if program has stages
        }) => ({
            trackedEntityInstance, 
            program,
            orgUnit,
            programStage,     // Include if needed
            eventDate: date,  // DHIS2 expects 'eventDate' field
            status: 'ACTIVE', // Optional but recommended
            dataValues: [
                { dataElement: 'xIgmOIGKlkr', value: attendance }, // Use actual data element UIDs
                { dataElement: 'FnpXlAn2N2t', value: startTime },
                { dataElement: 'FnpXlAn2N2t', value: endTime },
                { dataElement: 'Tak38cNTsWA', value: courseName },
                { dataElement: 'FnpXlAn2N2t', value: examRoom },
                { dataElement: 'FnpXlAn2N2t', value: supervisor },
                { dataElement:' sV4hJkorxay', value: date}
            ],
        }),
    };

    const [mutate, { loading, error, data }] = useDataMutation(mutation);

    const registerEvent = async (eventData) => {
        try {
            await mutate(eventData);
            return { success: true };
        } catch (err) {
            console.error('Error registering event:', err);
            return { success: false, error: err };
        }
    };

    return {
        loading,
        error,
        data,
        registerEvent,
    };
};

export { useRegisterEvent };