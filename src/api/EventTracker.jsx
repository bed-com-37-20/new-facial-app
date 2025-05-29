import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const EventTracker = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Listen for attendance session events
    socket.on('attendanceEvent', (eventData) => {
      setEvents(prevEvents => [...prevEvents, eventData]);
    });

    return () => {
      socket.off('attendanceEvent');
    };
  }, []);

  const logEvent = (event) => {
    socket.emit('logEvent', event);
  };

  const getEvents = () => {
    return events;
  };

  return {
    logEvent,
    getEvents,
  };
};

export default EventTracker;