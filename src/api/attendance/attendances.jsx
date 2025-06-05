import React, { useEffect, useState, useCallback } from 'react';
import './attendance.css'; // Import the CSS file

const Attendance = () => {
  // State management
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds

  // Get current session
  const currentSession = sessions.find(session => session.id === currentSessionId);

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

  // Fetch attendance data from the endpoint
  const fetchAttendanceData = useCallback(async () => {
    try {
      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data && data.length > 0 && currentSessionId) {
        // Update current session with new data
        setSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
            // Filter out existing students to avoid duplicates
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
    }
  }, [currentSessionId]);

  // Set up polling for attendance data
  useEffect(() => {
    let intervalId;
    
    if (currentSessionId) {
      // Fetch immediately
      fetchAttendanceData();
      
      // Then set up interval
      intervalId = setInterval(fetchAttendanceData, refreshInterval);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentSessionId, fetchAttendanceData, refreshInterval]);

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

  // Format date and time
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
                  s.id === currentSessionId ? {...s, endTime: new Date().toISOString()} : s
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('current')}
          className={activeTab === 'current' ? 'active' : ''}
        >
          Current Session
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={activeTab === 'history' ? 'active' : ''}
        >
          Session History
        </button>
      </div>

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
                  <tr key={session.id}>
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