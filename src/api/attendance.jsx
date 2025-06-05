import React, { useEffect, useState, useCallback } from 'react';
import './attendance.css';
import { useLocation } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
// import { useRegisterEvent } from '../hooks/api-calls/dataMutate'

const Attendance = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [refreshInterval, setRefreshInterval] = useState(5000);
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
    students, orgUnit } = location.state || {};

  console.log('Location state:', location.state);
  // Get current session
  const currentSession = sessions.find(session => session.id === currentSessionId);
  console.log(location.state)
  // Adjust these as needed
  const PROGRAM_ID = 'TLvAWiCKRgq';
  const REG_NUM_ATTR_UID = 'ofiRHvsg4Mt';
  const ORG_UNIT_UID = orgUnit

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


  // const { registerEvent,
  //   loading,
  //   errors,
  //   data, } = useRegisterEvent()
// console.log(teiData)
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
        course: sessionData.course
      }
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveTab('current');

    return newSession;
  }, []);

  const findTei = (stNumber) => {
    return teiArray.find((ti) => stNumber === ti.regNumber);
  }

  // Fetch attendance data
  const fetchAttendanceData = useCallback(async () => {
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
      data.map((st) => {
        if (st.status != "absent") {
          const teiId = findTei(st.registrationNumber)
          const Id = teiId.entityInstanceId

        const eventData = {
              trackedEntityInstance: Id,
              program: 'TLvAWiCKRgq',
              orgUnit: orgUnit,
              programStage: 'TLvAWiCKRgq',
              attendance: 'Present',
              startTime: startTime,
              endTime: endTime,
              date: date,
              courseName: courseName,
              examRoom: room,
              supervisor: supervisorName,
            };

          const result = registerEvent(eventData);
          console.log(result)

        }
      })
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

  // Match TEIs
  useEffect(() => {
    if (!teiData?.teis?.trackedEntityInstances || !currentSessionId) return;

    const students = sessions.find(s => s.id === currentSessionId)?.students || [];

    const matches = teiData.teis.trackedEntityInstances.filter(tei =>
      tei.attributes.some(attr =>
        attr.attribute === REG_NUM_ATTR_UID &&
        students.some(s => s.registrationNumber === attr.value)
      )
    );

    const matchedIds = matches.map(tei => tei.trackedEntityInstance);
    setMatchedTeiIds(matchedIds);
  }, [teiData, sessions, currentSessionId]);

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
  // Update teiArray whenever teiData changes
  // Update teiArray whenever teiData changes
  useEffect(() => {
    if (teiData?.students?.trackedEntityInstances) {
      const extractedData = teiData.students.trackedEntityInstances.map(tei => {
        // Find registration number (using both attribute and code for compatibility)
        const regNumberAttr = tei.attributes.find(attr =>
          attr.attribute === REG_NUM_ATTR_UID || attr.code === 'regnumber'
        );

        // Find first name (using both attribute and code for compatibility)
        const firstNameAttr = tei.attributes.find(attr =>
          attr.attribute === 'fname' || attr.code === 'fname'
        );

        return {
          entityInstanceId: tei.trackedEntityInstance,
          regNumber: regNumberAttr?.value || null,
          firstName: firstNameAttr?.value || null,
        };
      });

      setTeiArray(extractedData);
      console.log('Extracted TEI Data:', extractedData); // Log immediately after extraction
    }
  }, [teiData, REG_NUM_ATTR_UID]); // Add REG_NUM_ATTR_UID as dependency

  // Add separate useEffect to log teiArray when it updates
  useEffect(() => {
    console.log('Updated TEI Array:', teiArray);
  }, [teiArray]);

  // Log the updated array


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
              onClick={() => initNewSession({
                examId: `exam_${Date.now()}`,
                examName: 'New Session'
              })}
              className="start-session"
            >
              Start New Session
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
          onClick={() => setActiveTab('current')}
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
                <th>Details</th>
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
                      <td>{formatDateTime(session.startTime)} to {formatDateTime(session.endTime)}</td>
                      <td>{session.students.length}</td>
                      <td>{session.endTime ? 'Completed' : 'Active'}</td>
                      <td>
                        <button onClick={() => setCurrentSessionId(session.id)}>View</button>
                        <button onClick={() => console.log('Exporting session:', session)}>Export</button>
                      </td>
                    </tr>
                    {currentSessionId === session.id && (
                      <tr>
                        <td colSpan="6">
                          <div className="student-details">
                            <h4>Students Attended</h4>
                            <table className="table">
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
                                    <td colSpan="4">No students attended this session</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No sessions available</td>
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

