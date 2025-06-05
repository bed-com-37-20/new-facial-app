import { useDataQuery } from '@dhis2/app-runtime';
import { useDataMutation } from '@dhis2/app-runtime';
import { useEffect, useState } from 'react';


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
export { useRegisterEvent };
// Example usage in a component

export const useProgramsEvents = (programId, ou, dhis2BaseUrl, dhis2Auth, trackedEntityInstance) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!programId) return;

        const fetchEvents = async () => {
            setLoading(true);
            try {
                // Build base URL
                let url = `${dhis2BaseUrl}/api/events?ou=${ou}&program=${programId}`;

                // Add trackedEntityInstance parameter if provided
                if (trackedEntityInstance) {
                    url += `&trackedEntityInstance=${trackedEntityInstance}`;
                }

                const response = await fetch(url, {
                    headers: {
                        'Authorization': 'Basic ' + btoa(`${dhis2Auth.username}:${dhis2Auth.password}`),
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Failed to fetch events: ${text}`);
                }

                const data = await response.json();
                setEvents(data.events || []);
            } catch (err) {
                setError(err);
                console.error('Error fetching program events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [programId, ou, trackedEntityInstance]); // Include trackedEntityInstance in dependencies

    return { events, loading, error };
};

// Example usage:
// 1. With trackedEntityInstance
// const { events, loading, error } = useProgramsEvents('program123', 'orgUnit456', baseUrl, auth, 'tei789');

// 2. Without trackedEntityInstance
// const { events, loading, error } = useProgramsEvents('program123', 'orgUnit456', baseUrl, auth);