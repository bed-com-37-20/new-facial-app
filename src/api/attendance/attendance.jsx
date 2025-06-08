import React, { useEffect, useState, useCallback } from 'react';
import './Attendance.css';
import { useLocation } from 'react-router-dom';
import { markAllAbsent, camera } from '../Attendance/hooks';

const Attendance = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
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
  } = location.state

  const AB_END_POINT = 'https://facial-attendance-system-6vy8.onrender.com/attendance/mark-all-absent';
  const CAMERA_START = 'https://facial-attendance-system-6vy8.onrender.com/face/recognize';

  // Get current session
  const currentSession = sessions.find(session => session.id === currentSessionId);
  // Get the session being viewed
  const viewingSession = sessions.find(session => session.id === viewingSessionId);

  // Filter students based on registration numbers from location state
  const filterStudents = (sessionStudents) => {
    if (!students || !Array.isArray(students)) return [];
    return sessionStudents.filter(student =>
      students.includes(student.registrationNumber)
    );
  };

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

  useEffect(() => {
    console.log('Current Session:', students);
  }, [students]);
  return (
    <div className="container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className='h1' style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Attendance Monitoring</h1>
          <p className='p' style={{ fontSize: '16px', color: '#666' }}>{currentSession ? `Tracking: ${currentSession.examName}` : 'No active session'}</p>
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
              style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              End Session
            </button>
          ) : (
            <button
              onClick={async () => {
                const data = await markAllAbsent(AB_END_POINT);
                initNewSession({
                  examId: courseName.replace(/\s+/g, '_') + '_' + Date.now(),
                  examName: courseName,
                  room: room,
                  supervisor: supervisorName,
                  course: courseName
                })
              }}
              className="start-session"
              style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Start Session
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          <span className='span'>{error}</span>
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
          Current Session
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

      {activeTab === 'current' && currentSession && (
        <div className="current-session" style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <h2 className='h2' style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>{currentSession.examName}</h2>
          <div className="session-meta" style={{ marginBottom: '20px' }}>
            <p className='p' style={{ fontSize: '16px', color: '#666' }}>Room: {currentSession.metadata.room}</p>
            <p className='p' style={{ fontSize: '16px', color: '#666' }}>Supervisor: {currentSession.metadata.supervisor}</p>
            <p className='p' style={{ fontSize: '16px', color: '#666' }}>Started: {formatDateTime(currentSession.startTime)}</p>
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
                {filterStudents(currentSession.students).length > 0 ? (
                  filterStudents(currentSession.students).map(student => (
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
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <React.Fragment key={session.id}>
                    <tr className='tr' style={{ borderBottom: '1px solid #ddd' }}>
                      <td className='td' style={{ padding: '10px' }}>{session.examName}</td>
                      <td className='td' style={{ padding: '10px' }}>{session.metadata.course || 'N/A'}</td>
                      <td className='td' style={{ padding: '10px' }}>{session.metadata.date || 'N/A'}</td>
                      <td className='td' style={{ padding: '10px' }}>
                        {session.startTime && session.endTime ?
                          `${Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)} mins` :
                          'N/A'}
                      </td>
                      <td className='td' style={{ padding: '10px' }}>{filterStudents(session.students).length}</td>
                      <td className='td' style={{ padding: '10px' }}>{session.endTime ? 'Completed' : 'Active'}</td>
                      <td className='td' style={{ padding: '10px' }}>
                        <button className='button' onClick={() => setViewingSessionId(session.id)} style={{ padding: '5px 10px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          View
                        </button>
                      </td>
                    </tr>
                    {viewingSessionId === session.id && (
                      <tr className='tr'>
                        <td className='td' colSpan="7" style={{ padding: '10px' }}>
                          <div className="session-details" style={{ padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px' }}>
                            <h4 className='h4' style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Attendance Details for {session.examName}</h4>
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
                              style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
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
                  <td className='td' colSpan="7" style={{ padding: '10px', textAlign: 'center', color: '#666' }}>No sessions available</td>
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