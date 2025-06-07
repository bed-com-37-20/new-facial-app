import React, { useEffect, useState, useCallback } from 'react';
import './Attendance.css';
import { useLocation } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import {markAllAbsent, camera}  from './Attendance/hooks'; // Assuming this function is defined in attendanceUtils.js

const Attendance = () => {
  // Load sessions from localStorage on initial render
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('attendance_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [refreshInterval, setRefreshInterval] = useState(20000);
  const [matchedTeiIds, setMatchedTeiIds] = useState([]);
  const [teiArray, setTeiArray] = useState([]);

  const location = useLocation();
  const {
    courseName,
    date,
    room,
    supervisorName,
    startTime,
    endTime,
    students,
    orgUnit
  } = location.state || {};

  const AB_END_POINT = 'https://facial-attendance-system-6vy8.onrender.com/attendance/mark-all-absent';
  const CAMERA_START = 'https://facial-attendance-system-6vy8.onrender.com/face/recognize';
  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('attendance_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Get current session
  const currentSession = sessions.find(session => session.id === currentSessionId);
  // Get the session being viewed
  const viewingSession = sessions.find(session => session.id === viewingSessionId);

  const PROGRAM_ID = 'TLvAWiCKRgq';
  const REG_NUM_ATTR_UID = 'ofiRHvsg4Mt';
  const ORG_UNIT_UID = orgUnit;

  // DHIS2 query for tracked entity instances
  const teiQuery = {
    students: {
      resource: 'trackedEntityInstances',
      params: {
        ou: ORG_UNIT_UID,
      }
    }
  };

  const { data: teiData, error: teiError, refetch: refetchTeis } = useDataQuery(teiQuery);

  // Initialize a new session
  const initNewSession = useCallback((sessionData) => {
    const newSession = {
      id: `session_${Date.now()}`,
      examId: sessionData.examId,
      examName: sessionData.examName || `Exam ${sessionData.examId}`,
      startTime: new Date().toISOString(),
      endTime: null,
      students: [],
      metadata: {
        room: sessionData.room,
        supervisor: sessionData.supervisor,
        course: sessionData.course,
        date: date,
        startTime: startTime,
        endTime: endTime,
        orgUnit: orgUnit,
        selectedStudents: students || []
      }
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveTab('current');
    setViewingSessionId(null); // Clear any viewing session when starting new

    return newSession;
  }, [date, endTime, orgUnit, startTime, students]);

  const findTei = (stNumber) => {
    return teiArray.find((ti) => stNumber === ti.regNumber);
  }

  // Fetch attendance data
  const fetchAttendanceData = useCallback(async () => {
    const data = camera(CAMERA_START);
    try {
      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance');
      if (!response.ok) {
        alert('There is error from server..')
      };

      const data = await response.json();

      if (data && data.length > 0 && currentSessionId) {
        setSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
            const newStudents = data.filter(newStudent =>
              !session.students.some(existing =>
                existing.registrationNumber === newStudent.registrationNumber
              )
            ).map(student => ({
              ...student,
              id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
              status: student.status || 'present'
            }));

            return {
              ...session,
              students: [...session.students, ...newStudents]
            };
          }
          return session;
        }));
      }
      console.log('Attendance data fetched successfully:', data);
    } catch (err) {
      setError(`Failed to fetch attendance data: ${err.message}`);
      console.error('Error fetching attendance data:', err);
    }
  }, [currentSessionId]);

  // Poll attendance data
  useEffect(() => {
    let intervalId;
    if (currentSessionId) {
      fetchAttendanceData();
      intervalId = setInterval(fetchAttendanceData, refreshInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentSessionId, fetchAttendanceData, refreshInterval]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      present: 'status-badge present',
      absent: 'status-badge absent',
      late: 'status-badge late',
      default: 'status-badge default'
    };
    const statusText = {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      default: 'Unknown'
    };
    return (
      <span className={statusClasses[status] || statusClasses.default}>
        {statusText[status] || statusText.default}
      </span>
    );
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Attendance Monitoring</h1>
          <p>{currentSession ? `Tracking: ${currentSession.examName}` : 'No active session'}</p>
        </div>
        <div>
          {currentSession ? (
            <button
              onClick={() => {
                setSessions(prev => prev.map(s =>
                  s.id === currentSessionId ? { ...s, endTime: new Date().toISOString() } : s
                ));
                setCurrentSessionId(null);
              }}
              className="end-session"
            >
              End Session
            </button>
          ) : (
            <button
                onClick={async() => {

                  const data = await markAllAbsent(AB_END_POINT);
                  initNewSession({
                    examId: courseName.replace(/\s+/g, '_') + '_' + Date.now(),
                    examName: courseName,
                    room: room,
                    supervisor: supervisorName,
                    course: courseName
                  })
                
                }
                }
              className="start-session"
            >
              Start Session
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      <div className="tab-navigation">
        <button
          onClick={() => {
            setActiveTab('current');
            setViewingSessionId(null); // Clear viewing when switching tabs
          }}
          className={activeTab === 'current' ? 'active' : ''}
          style={{ color: 'black' }}
        >
          Current Session
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={activeTab === 'history' ? 'active' : ''}
          style={{ color: 'black' }}
        >
          Session History
        </button>
      </div>

      {activeTab === 'current' && currentSession && (
        <div className="matched-events">
          <h3>Matched DHIS2 TEI IDs</h3>
          <button onClick={() => refetchTeis()}>Refresh Matches</button>
          <ul>
            {matchedTeiIds.length > 0 ? (
              matchedTeiIds.map(id => <li key={id}>{id}</li>)
            ) : (
              <li>No matches found</li>
            )}
          </ul>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="session-history">
          <table className="table">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Course</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <React.Fragment key={session.id}>
                    <tr>
                      <td>{session.examName}</td>
                      <td>{session.metadata.course || 'N/A'}</td>
                      <td>{session.metadata.date || 'N/A'}</td>
                      <td>
                        {session.startTime && session.endTime ?
                          `${Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)} mins` :
                          'N/A'}
                      </td>
                      <td>{session.students.length}</td>
                      <td>{session.endTime ? 'Completed' : 'Active'}</td>
                      <td>
                        <button onClick={() => setViewingSessionId(session.id)}>
                          View
                        </button>
                      </td>
                    </tr>
                    {viewingSessionId === session.id && (
                      <tr>
                        <td colSpan="7">
                          <div className="session-details">
                            <h4>Attendance Details for {session.examName}</h4>
                            <table className="student-table">
                              <thead>
                                <tr>
                                  <th>Student ID</th>
                                  <th>Name</th>
                                  <th>Status</th>
                                  <th>Time Recorded</th>
                                </tr>
                              </thead>
                              <tbody>
                                {session.students.length > 0 ? (
                                  session.students.map((student) => (
                                    <tr key={student.id}>
                                      <td>{student.registrationNumber}</td>
                                      <td>{student.name || 'N/A'}</td>
                                      <td><StatusBadge status={student.status} /></td>
                                      <td>{formatDateTime(student.timestamp)}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="4">No attendance records</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                            <button
                              onClick={() => setViewingSessionId(null)}
                              className="close-details"
                            >
                              Close Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No sessions available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;