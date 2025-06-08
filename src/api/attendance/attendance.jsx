import React, { useEffect, useState, useCallback } from 'react';
import './Attendance.css';
import { useLocation } from 'react-router-dom';
import { markAllAbsent, camera } from '../Attendance/hooks';

const Attendance = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionIds, setCurrentSessionIds] = useState([]);
  const [viewingSessionId, setViewingSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [refreshInterval, setRefreshInterval] = useState(20000);
  const [matchedTeiIds, setMatchedTeiIds] = useState([]);

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
  const SAVE_SESSION_ENDPOINT = 'https://facial-attendance-system-6vy8.onrender.com/sessions/save';

  // Get current sessions
  const currentSessions = sessions.filter(session => currentSessionIds.includes(session.id));
  // Get the session being viewed
  const viewingSession = sessions.find(session => session.id === viewingSessionId);

  // Filter students based on registration numbers from location state
  const filterStudents = (sessionStudents) => {
    if (!students || !Array.isArray(students)) return [];
    return sessionStudents.filter(student =>
      students.includes(student.registrationNumber)
    );
  };

  // Save session to server
  const saveSessionToServer = async (session) => {
    try {
      setIsLoading(true);
      const response = await fetch(SAVE_SESSION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error(`Failed to save session: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Session saved successfully:', data);
      return data;
    } catch (err) {
      console.error('Error saving session:', err);
      setError(`Failed to save session: ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize a new session
  const initNewSession = useCallback(async (sessionData) => {
    try {
      if (!courseName || !students) {
        throw new Error('Missing required session data');
      }

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
      setCurrentSessionIds(prev => [...prev, newSession.id]);
      setActiveTab('current');
      setViewingSessionId(null);
      setError(null);

      return newSession;
    } catch (err) {
      setError(`Failed to start session: ${err.message}`);
      console.error('Error initializing session:', err);
      throw err;
    }
  }, [courseName, date, endTime, orgUnit, startTime, students]);

  // End a session
  const endSession = async (sessionId) => {
    try {
      const sessionToEnd = sessions.find(s => s.id === sessionId);
      if (!sessionToEnd) {
        throw new Error('Session not found');
      }

      const updatedSession = {
        ...sessionToEnd,
        endTime: new Date().toISOString()
      };

      // Update local state first
      setSessions(prev => prev.map(s =>
        s.id === sessionId ? updatedSession : s
      ));
      setCurrentSessionIds(prev => prev.filter(id => id !== sessionId));

      // Save to server
      await saveSessionToServer(updatedSession);
      setError(null);
    } catch (err) {
      setError(`Failed to end session: ${err.message}`);
      console.error('Error ending session:', err);
    }
  };

  // Fetch attendance data for a specific session
  const fetchAttendanceData = useCallback(async (sessionId) => {
    try {
      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance');
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }

      const data = await response.json();
      console.log('Attendance data fetched successfully:', data);

      if (data && data.length > 0) {
        setSessions(prev => prev.map(session => {
          if (session.id === sessionId) {
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
    } catch (err) {
      setError(`Failed to fetch attendance data: ${err.message}`);
      console.error('Error fetching attendance data:', err);
      // Cancel this session on error
      setCurrentSessionIds(prev => prev.filter(id => id !== sessionId));
    }
  }, []);

  // Poll attendance data for all active sessions
  useEffect(() => {
    const intervalIds = {};

    currentSessionIds.forEach(sessionId => {
      // Initial fetch
      fetchAttendanceData(sessionId);
      // Set up interval
      intervalIds[sessionId] = setInterval(() => fetchAttendanceData(sessionId), refreshInterval);
    });

    return () => {
      Object.values(intervalIds).forEach(intervalId => clearInterval(intervalId));
    };
  }, [currentSessionIds, fetchAttendanceData, refreshInterval]);

  // Status badge component
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

  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const minutes = Math.round((new Date(end) - new Date(start)) / 60000);
    return `${minutes} mins`;
  };

  return (
    <div className="container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className='h1' style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Attendance Monitoring</h1>
          <p className='p' style={{ fontSize: '16px', color: '#666' }}>
            {currentSessions.length > 0
              ? `Tracking ${currentSessions.length} active session(s)`
              : 'No active sessions'}
          </p>
        </div>
        <div>
          <button
            onClick={async () => {
              try {
                const data = await markAllAbsent(AB_END_POINT);
                const newSession = await initNewSession({
                  examId: courseName.replace(/\s+/g, '_') + '_' + Date.now(),
                  examName: courseName,
                  room: room,
                  supervisor: supervisorName,
                  course: courseName
                });
                console.log('New session started:', newSession);
              } catch (err) {
                console.error('Error starting session:', err);
              }
            }}
            className="start-session"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Start New Session'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span className='span'>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#721c24',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="tab-navigation" style={{ display: 'flex', marginBottom: '20px' }}>
        <button
          onClick={() => {
            setActiveTab('current');
            setViewingSessionId(null);
          }}
          className={activeTab === 'current' ? 'active' : ''}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: activeTab === 'current' ? '#3498db' : '#ecf0f1',
            color: activeTab === 'current' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Current Sessions
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={activeTab === 'history' ? 'active' : ''}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: activeTab === 'history' ? '#3498db' : '#ecf0f1',
            color: activeTab === 'history' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Session History
        </button>
      </div>

      {activeTab === 'current' && (
        <div className="current-sessions-container">
          {currentSessions.length > 0 ? (
            currentSessions.map(session => (
              <div key={session.id} className="current-session" style={{
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 className='h2' style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                      {session.examName}
                    </h2>
                    <div className="session-meta" style={{ marginBottom: '20px' }}>
                      <p className='p' style={{ fontSize: '16px', color: '#666' }}>Room: {session.metadata.room}</p>
                      <p className='p' style={{ fontSize: '16px', color: '#666' }}>Supervisor: {session.metadata.supervisor}</p>
                      <p className='p' style={{ fontSize: '16px', color: '#666' }}>Started: {formatDateTime(session.startTime)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => endSession(session.id)}
                    className="end-session"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start'
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Ending...' : 'End Session'}
                  </button>
                </div>

                <div className="attendance-table" style={{ overflowX: 'auto' }}>
                  <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead className='thead' style={{ backgroundColor: '#3498db', color: '#fff' }}>
                      <tr className='tr'>
                        <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Student ID</th>
                        <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                        <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                        <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Time Recorded</th>
                      </tr>
                    </thead>
                    <tbody className='tbody'>
                      {filterStudents(session.students).length > 0 ? (
                        filterStudents(session.students).map(student => (
                          <tr className='tr' key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td className='td' style={{ padding: '10px' }}>{student.registrationNumber}</td>
                            <td className='td' style={{ padding: '10px' }}>{student.name || 'N/A'}</td>
                            <td className='td' style={{ padding: '10px' }}><StatusBadge status={student.status} /></td>
                            <td className='td' style={{ padding: '10px' }}>{formatDateTime(student.timestamp)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className='tr'>
                          <td className='td' colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>No attendance records yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="no-sessions" style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: '#666'
            }}>
              No active sessions. Click "Start New Session" to begin.
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="session-history" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <table className="sessions-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead className='thead' style={{ backgroundColor: '#3498db', color: '#fff' }}>
              <tr className='tr'>
                <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Exam</th>
                <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Course</th>
                <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Duration</th>
                <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Students</th>
                <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody className='tbody'>
              {sessions.filter(s => !currentSessionIds.includes(s.id)).length > 0 ? (
                sessions.filter(s => !currentSessionIds.includes(s.id)).map((session) => (
                  <React.Fragment key={session.id}>
                    <tr className='tr' style={{ borderBottom: '1px solid #ddd' }}>
                      <td className='td' style={{ padding: '10px' }}>{session.examName}</td>
                      <td className='td' style={{ padding: '10px' }}>{session.metadata.course || 'N/A'}</td>
                      <td className='td' style={{ padding: '10px' }}>{session.metadata.date || 'N/A'}</td>
                      <td className='td' style={{ padding: '10px' }}>
                        {formatDuration(session.startTime, session.endTime)}
                      </td>
                      <td className='td' style={{ padding: '10px' }}>{filterStudents(session.students).length}</td>
                      <td className='td' style={{ padding: '10px' }}>{session.endTime ? 'Completed' : 'Active'}</td>
                      <td className='td' style={{ padding: '10px' }}>
                        <button
                          className='button'
                          onClick={() => setViewingSessionId(session.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#3498db',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                    {viewingSessionId === session.id && (
                      <tr className='tr'>
                        <td className='td' colSpan="7" style={{ padding: '10px' }}>
                          <div className="session-details" style={{ padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
                            <h4 className='h4' style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                              Attendance Details for {session.examName}
                            </h4>
                            <div style={{ marginBottom: '15px' }}>
                              <p><strong>Room:</strong> {session.metadata.room}</p>
                              <p><strong>Supervisor:</strong> {session.metadata.supervisor}</p>
                              <p><strong>Start Time:</strong> {formatDateTime(session.startTime)}</p>
                              <p><strong>End Time:</strong> {formatDateTime(session.endTime)}</p>
                              <p><strong>Duration:</strong> {formatDuration(session.startTime, session.endTime)}</p>
                            </div>
                            <table className="student-details-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead className='thead' style={{ backgroundColor: '#3498db', color: '#fff' }}>
                                <tr className='tr'>
                                  <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Student ID</th>
                                  <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                                  <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                                  <th className='th' style={{ padding: '10px', textAlign: 'left' }}>Time Recorded</th>
                                </tr>
                              </thead>
                              <tbody className='tbody'>
                                {filterStudents(session.students).length > 0 ? (
                                  filterStudents(session.students).map((student) => (
                                    <tr className='tr' key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
                                      <td className='td' style={{ padding: '10px' }}>{student.registrationNumber}</td>
                                      <td className='td' style={{ padding: '10px' }}>{student.name || 'N/A'}</td>
                                      <td className='td' style={{ padding: '10px' }}><StatusBadge status={student.status} /></td>
                                      <td className='td' style={{ padding: '10px' }}>{formatDateTime(student.timestamp)}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr className='tr'>
                                    <td className='td' colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>No attendance records</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                            <button
                              onClick={() => setViewingSessionId(null)}
                              className="close-details"
                              style={{
                                padding: '10px 20px',
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                              }}
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
                <tr className='tr'>
                  <td className='td' colSpan="7" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>No completed sessions available</td>
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