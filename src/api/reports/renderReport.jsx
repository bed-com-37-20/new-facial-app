import React from 'react';
import { useProgramsEvents } from '../../hooks/api-calls/dataMutate';

const MyProgramEvents = ({ou,instance}) => {
    const programId = 'TLvAWiCKRgq'; // Replace with your actual program ID
    const dhis2BaseUrl = 'http://localhost:8081';
    const dhis2Auth = {
        username: 'admin',
        password: 'district',
    };

    const { events, loading, error } = useProgramsEvents(programId, ou, dhis2BaseUrl, dhis2Auth, instance);

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>Events for Program {programId}</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {events.map((event) => (
                    <li style={{backgroundColor:'blue', margin:'5px', padding:'10px'}} key={event.event}>
                        {event.eventDate} - {event.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyProgramEvents;
