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
    const mutation = {
        type: 'create',
        resource: 'events',
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
            supervisor,
        }) => ({
            trackedEntityInstance,
            program,
            orgUnit,
            programStage,
            eventDate: date,
            status: 'ACTIVE',
            dataValues: [
                { dataElement: 'xIgmOIGKlkr', value: attendance },   // Attendance
                { dataElement: 'ZCvzGgOWhpD', value: startTime },    // Start Time
                { dataElement: 'wS32daZ8JYx', value: endTime },      // End Time
                { dataElement: 'Tak38cNTsWA', value: courseName },   // Course Name
                { dataElement: 'ABcXlR45qPt', value: examRoom },     // Exam Room
                { dataElement: 'uK7gdfDsLPx', value: supervisor },   // Supervisor
                { dataElement: 'sV4hJkorxay', value: date },         // Exam Date
            ],
        }),
    }

    const [mutate, { loading, error, data }] = useDataMutation(mutation)

    const registerEvent = async (eventData) => {
        try {
            await mutate(eventData)
            return { success: true, data }
        } catch (err) {
            console.error('Error registering event:', err)
            return { success: false, error: err }
        }
    }

    return {
        registerEvent,
        loading,
        error,
        data,
    }
}

export { useRegisterEvent }
