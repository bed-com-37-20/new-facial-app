import React, { useEffect, useState, useCallback } from 'react';
import './Attendance.css';
import { useLocation } from 'react-router-dom';
import { markAllAbsent, camera } from '../Attendance/hooks';

// Constants
const API_ENDPOINTS = {
  MARK_ABSENT: 'https://facial-attendance-system-6vy8.onrender.com/attendance/mark-all-absent',
  CAMERA_START: 'https://facial-attendance-system-6vy8.onrender.com/face/recognize',
  SAVE_SESSION: 'https://facial-attendance-system-6vy8.onrender.com/attendance/create-new-coures'
};

// Helper components
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

// Helper functions
const formatDateTime = (isoString) => isoString ? new Date(isoString).toLocaleString() : 'N/A';
const formatTime = (timeString) => timeString ? new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
const formatDuration = (start, end) => (start && end) ? `${Math.round((new Date(end) - new Date(start)) / 60000)} mins` : 'N/A';

const Attendance = () => {
  // State management
  const [state, setState] = useState({
    sessions: [],
    currentSessionIds: [],
    viewingSessionId: null,
    error: null,
    isLoading: false,
    activeTab: 'current',
    refreshInterval: 20000,
    cameraStarted: false,
    networkError: null,
    failedSession: null,
    showDialog: false,
    pendingSessions: []
  });
  const [sessionStart, setSessionStart] = useState(false);

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

  // Derived state
  const currentSessions = state.sessions.filter(session =>
    state.currentSessionIds.includes(session.id)
  );
  const viewingSession = state.sessions.find(session =>
    session.id === state.viewingSessionId
  );

  // Data persistence
  const saveSessionToLocalStorage = useCallback((session) => {
    try {
      const savedSessions = JSON.parse(localStorage.getItem('attendanceSessions') || '[]');
      localStorage.setItem('attendanceSessions', JSON.stringify([...savedSessions, session]));
    } catch (err) {
      console.error('Local storage save error:', err);
    }
  }, []);

  // API operations
  const saveSessionToServer = useCallback(async (session) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const filteredSession = {
        metadata: {
          room: session.metadata.room,
          supervisor: session.metadata.supervisor,
          examName: session.metadata.courseName,
          date: session.metadata.date,
          startTime: session.metadata.startTime,
          endTime: session.metadata.endTime,
          studentsIds: session.metadata.selectedStudents
        }
      };

      const response = await fetch(API_ENDPOINTS.SAVE_SESSION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filteredSession.metadata)
      });

      if (!response.ok) {
        setState(prev => ({ ...prev, showDialog: true }));
      } else {
        alert('Session saved successfully');
      }

      return filteredSession;
    } catch (err) {
      alert('Error saving session:', err);
      setState(prev => ({ ...prev, error: `Failed to save session: ${err.message}`, showDialog: true }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchAttendanceData = useCallback(async (sessionId) => {
    try {
      await camera(API_ENDPOINTS.CAMERA_START, (status) =>
        setState(prev => ({ ...prev, cameraStarted: status }))
      );

      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance');
      if (!response.ok) alert('Failed to fetch attendance data');

      const data = await response.json();
      console.log('Attendance data:', data);

      if (data?.length > 0) {
        setState(prev => ({
          ...prev,
          sessions: prev.sessions.map(session => {
            if (session.id !== sessionId) return session;

            const updatedStudents = data
              .filter(newStudent => session.metadata.selectedStudents.includes(newStudent.registrationNumber))
              .map(student => ({
                ...student,
                id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString(),
                status: student.status
              }));

            return { ...session, students: updatedStudents };
          })
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: `Failed to fetch attendance data: ${err.message}`,
        currentSessionIds: prev.currentSessionIds.filter(id => id !== sessionId)
      }));
      console.error('Fetch error:', err);
    }
  }, []);

  // Session management
  const initNewSession = useCallback(async (sessionData, startNow = true) => {
    try {
      if (!courseName || !students) {
        alert('Missing required session data');
        return;
      }

      const newSession = {
        id: `session_${Date.now()}`,
        examId: `${courseName.replace(/\s+/g, '_')}_${Date.now()}`,
        examName: courseName,
        startTime: startNow ? new Date().toISOString() : null,
        endTime: null,
        students: [],
        metadata: {
          room,
          supervisor: supervisorName,
          courseName,
          date,
          startTime,
          endTime,
          orgUnit,
          selectedStudents: students || []
        }
      };

      setState(prev => ({
        ...prev,
        sessions: [newSession, ...prev.sessions],
        ...(startNow
          ? { currentSessionIds: [...prev.currentSessionIds, newSession.id] }
          : { pendingSessions: [...prev.pendingSessions, newSession] }
        ),
        activeTab: 'current',
        viewingSessionId: null,
        error: null
      }));

      if (startNow) {
        await markAllAbsent(API_ENDPOINTS.MARK_ABSENT, (error) =>
          setState(prev => ({ ...prev, networkError: error }))
        );
      }

      return newSession;
    } catch (err) {
      setState(prev => ({ ...prev, error: `Failed to start session: ${err.message}` }));
      console.error('Session init error:', err);
      alert('Failed to start session, check your internet connection');
    }
  }, [courseName, date, endTime, orgUnit, room, startTime, students, supervisorName]);

  const endSession = useCallback(async (sessionId) => {
    try {
      const sessionToEnd = state.sessions.find(s => s.id === sessionId);
      if (!sessionToEnd) {
        alert('Session not found');
        return;
      }

      const updatedSession = {
        ...sessionToEnd,
        endTime: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        sessions: prev.sessions.map(s => s.id === sessionId ? updatedSession : s),
        currentSessionIds: prev.currentSessionIds.filter(id => id !== sessionId),
        failedSession: updatedSession
      }));

      saveSessionToLocalStorage(updatedSession);
      // await saveSessionToServer(updatedSession);
      setState(prev => ({ ...prev, error: null }));
    } catch (err) {
      setState(prev => ({ ...prev, error: `Failed to end session: ${err.message}` }));
      alert('Error ending session:', err);
    }
  }, [state.sessions, saveSessionToLocalStorage, saveSessionToServer]);

  // Effects
  useEffect(() => {
    const checkPendingSessions = () => {
      const now = new Date();
      const sessionsToStart = state.pendingSessions.filter(session => {
        const sessionStartTime = new Date(`${session.metadata.date}T${session.metadata.startTime}`);
        return sessionStartTime <= now;
      });

      if (sessionsToStart.length > 0) {
        sessionsToStart.forEach(session => {
          startPendingSession(session);
        });
        setState(prev => ({
          ...prev,
          pendingSessions: prev.pendingSessions.filter(session =>
            !sessionsToStart.includes(session))
        }));
      }
    };

    const interval = setInterval(checkPendingSessions, 60000);
    checkPendingSessions();

    return () => clearInterval(interval);
  }, [state.pendingSessions]);

  useEffect(() => {
    const intervalIds = {};

    state.currentSessionIds.forEach(sessionId => {
      fetchAttendanceData(sessionId);
      intervalIds[sessionId] = setInterval(
        () => fetchAttendanceData(sessionId),
        state.refreshInterval
      );
    });

    return () => {
      Object.values(intervalIds).forEach(clearInterval);
    };
  }, [state.currentSessionIds, state.refreshInterval, fetchAttendanceData]);

  // Helper functions
  const startPendingSession = async (session) => {
    try {
      setState(prev => ({
        ...prev,
        currentSessionIds: [...prev.currentSessionIds, session.id],
        sessions: prev.sessions.map(s =>
          s.id === session.id ? { ...s, startTime: new Date().toISOString() } : s
        )
      }));

      await markAllAbsent(API_ENDPOINTS.MARK_ABSENT, (error) =>
        setState(prev => ({ ...prev, networkError: error }))
      );
    } catch (err) {
      setState(prev => ({ ...prev, error: `Failed to start pending session: ${err.message}` }));
    }
  };

  const handleStartSession = async (startNow) => {
    setSessionStart(true)
    try {
      await markAllAbsent(API_ENDPOINTS.MARK_ABSENT, (error) =>
        setState(prev => ({ ...prev, networkError: error }))
      );

      await initNewSession({
        examId: courseName.replace(/\s+/g, '_') + '_' + Date.now(),
        examName: courseName,
        room,
        supervisor: supervisorName,
        course: courseName
      }, startNow);
      setSessionStart(false)
    } catch (err) {
      setSessionStart(false)
      console.error('Session start error:', err);
    }
  };

  const filterStudents = (sessionStudents) => {
    if (!students || !Array.isArray(students)) return [];

    const defaultStudents = students.map(regNumber => ({
      registrationNumber: regNumber,
      name: 'N/A',
      status: 'absent',
      timestamp: new Date().toISOString(),
      id: `default_${regNumber}`
    }));

    if (!sessionStudents || sessionStudents.length === 0) {
      return defaultStudents;
    }

    return defaultStudents.map(defaultStudent => {
      const found = sessionStudents.find(s => s.registrationNumber === defaultStudent.registrationNumber);
      return found || defaultStudent;
    });
  };

  // UI handlers
  const retrySave = () => {
    setState(prev => ({ ...prev, showDialog: false }));
    saveSessionToServer(state.failedSession);
  };

  const cancelSave = () => {
    setState(prev => ({ ...prev, showDialog: false }));
  };

  // Render functions
  const renderSessionDetails = (session) => (
    <div className="session-details" style={{ padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
      <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
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
        <thead style={{ backgroundColor: '#3498db', color: '#fff' }}>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left' }}>Student ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Time Recorded</th>
          </tr>
        </thead>
        <tbody>
          {filterStudents(session.students).length > 0 ? (
            filterStudents(session.students).map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{student.registrationNumber}</td>
                <td style={{ padding: '10px' }}>{student.name || 'N/A'}</td>
                <td style={{ padding: '10px' }}><StatusBadge status={student.status} /></td>
                <td style={{ padding: '10px' }}>{formatDateTime(student.timestamp)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                No attendance records
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={() => setState(prev => ({ ...prev, viewingSessionId: null }))}
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
  );

  const renderCurrentSessions = () => (
    <div className="current-sessions-container">
      {currentSessions.length > 0 ? (
        currentSessions.map(session => (
          <div key={session.id} style={{
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                  {session.examName}
                </h2>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '16px', color: '#666' }}>Room: {session.metadata.room}</p>
                  <p style={{ fontSize: '16px', color: '#666' }}>Supervisor: {session.metadata.supervisor}</p>
                  <p style={{ fontSize: '16px', color: '#666' }}>Started: {formatDateTime(session.startTime)}</p>
                </div>
              </div>
              <button
                onClick={() => endSession(session.id)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
                disabled={state.isLoading}
              >
                {state.isLoading ? 'Ending...' : 'End Session'}
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#3498db', color: '#fff' }}>
                  <tr>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Student ID</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Time Recorded</th>
                  </tr>
                </thead>
                <tbody>
                  {filterStudents(session.students).length > 0 ? (
                    filterStudents(session.students).map(student => (
                      <tr key={student.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px' }}>{student.registrationNumber}</td>
                        <td style={{ padding: '10px' }}>{student.name || 'N/A'}</td>
                        <td style={{ padding: '10px' }}><StatusBadge status={student.status} /></td>
                        <td style={{ padding: '10px' }}>{formatDateTime(student.timestamp)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                        No attendance records yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div style={{
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
  );

  const renderSessionHistory = () => (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#3498db', color: '#fff' }}>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left' }}>Exam</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Course</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Duration</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Students</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.sessions.filter(s => !state.currentSessionIds.includes(s.id)).length > 0 ? (
            state.sessions.filter(s => !state.currentSessionIds.includes(s.id)).map((session) => (
              <React.Fragment key={session.id}>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{session.examName}</td>
                  <td style={{ padding: '10px' }}>{session.metadata.course || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{session.metadata.date || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>
                    {formatDuration(session.startTime, session.endTime)}
                  </td>
                  <td style={{ padding: '10px' }}>{filterStudents(session.students).length}</td>
                  <td style={{ padding: '10px' }}>{session.endTime ? 'Completed' : 'Active'}</td>
                  <td style={{ padding: '10px' }}>
                    <button
                      onClick={() => setState(prev => ({ ...prev, viewingSessionId: session.id }))}
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
                {state.viewingSessionId === session.id && (
                  <tr>
                    <td colSpan="7" style={{ padding: '10px' }}>
                      {renderSessionDetails(session)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                No completed sessions available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Attendance Monitoring</h1>
          <p style={{ fontSize: '16px', color: '#666' }}>
            {currentSessions.length > 0
              ? `Tracking ${currentSessions.length} active session(s)`
              : 'No active sessions'}
          </p>
          {state.pendingSessions.length > 0 && (
            <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              {state.pendingSessions.length} session(s) scheduled to start automatically
            </p>
          )}
        </div>
        <div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleStartSession(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              disabled={state.isLoading}
            >
              { sessionStart ? 'Starting...':'Start Session Now'}
            </button>
            <button
              onClick={() => handleStartSession(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              disabled={state.isLoading}
            >
              Schedule for {formatTime(startTime)}
            </button>
          </div>
          <div style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f1f1f1',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            color: '#333',
            fontSize: '14px'
          }}>
            <p style={{ margin: 0 }}>Camera Status</p>
            <span style={{
              color: state.cameraStarted ? '#2ecc71' : '#e74c3c',
              fontWeight: 'bold'
            }}>
              {state.cameraStarted ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{state.error}</span>
          <button
            onClick={() => setState(prev => ({ ...prev, error: null }))}
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

      {/* Pending Sessions */}
      {state.pendingSessions.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '10px' }}>Scheduled Sessions</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {state.pendingSessions.map(session => (
              <div key={session.id} style={{
                padding: '15px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                width: '300px'
              }}>
                <h4 style={{ fontSize: '16px', marginBottom: '5px' }}>{session.examName}</h4>
                <p style={{ fontSize: '14px', color: '#666' }}>Room: {session.metadata.room}</p>
                <p style={{ fontSize: '14px', color: '#666' }}>Scheduled: {formatTime(session.metadata.startTime)}</p>
                <button
                  onClick={() => {
                    startPendingSession(session);
                    setState(prev => ({
                      ...prev,
                      pendingSessions: prev.pendingSessions.filter(s => s.id !== session.id)
                    }));
                  }}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#2ecc71',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Start Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <button
          onClick={() => setState(prev => ({ ...prev, activeTab: 'current', viewingSessionId: null }))}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: state.activeTab === 'current' ? '#3498db' : '#ecf0f1',
            color: state.activeTab === 'current' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Current Sessions
        </button>
        <button
          onClick={() => setState(prev => ({ ...prev, activeTab: 'history' }))}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: state.activeTab === 'history' ? '#3498db' : '#ecf0f1',
            color: state.activeTab === 'history' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Session History
        </button>
      </div>

      {/* Main Content */}
      {state.activeTab === 'current' ? renderCurrentSessions() : renderSessionHistory()}

      {/* Save Failed Dialog */}
      {state.showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            width: '400px',
            maxWidth: '90%',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
              Save Failed
            </h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
              There is Network connection error when starting session. Please check your network connectivity
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
           
              <button
                onClick={cancelSave}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Attendance;
