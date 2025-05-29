import React, { useEffect, useState, useCallback } from 'react';

const Attendance = () => {
  // State management
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

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
    
    return newSession;
  }, []);

  // Add student to current session
  const addStudentToSession = useCallback((studentData) => {
    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        // Check if student already exists in this session
        const exists = session.students.some(
          s => s.registrationNumber === studentData.registrationNumber
        );
        
        if (!exists) {
          return {
            ...session,
            students: [
              ...session.students,
              {
                ...studentData,
                id: `student_${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: studentData.status || 'present'
              }
            ]
          };
        }
      }
      return session;
    }));
  }, [currentSessionId]);

  // End current session
  const endCurrentSession = useCallback(() => {
    if (!currentSessionId) return;
    
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { ...session, endTime: new Date().toISOString() }
        : session
    ));
    setCurrentSessionId(null);
    
    // Clear the polling interval when session ends
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [currentSessionId, pollingInterval]);

  // Fetch attendance data from the endpoint
  const fetchAttendanceData = useCallback(async () => {
    try {
      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Process the attendance data
        data.forEach(student => {
          if (!currentSessionId) {
            // Auto-create session if none exists
            initNewSession({
              examId: 'auto-generated',
              examName: 'Auto-created Session'
            });
          }
          addStudentToSession(student);
        });
      }
    } catch (err) {
      setError(`Failed to fetch attendance data: ${err.message}`);
      console.error('Error fetching attendance data:', err);
    }
  }, [currentSessionId, initNewSession, addStudentToSession]);

  // Start polling for attendance data
  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    // Fetch immediately and then set up interval
    fetchAttendanceData();
    const interval = setInterval(fetchAttendanceData, 5000); // Poll every 5 seconds
    setPollingInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchAttendanceData, pollingInterval]);

  // Start polling when a new session is created
  useEffect(() => {
    if (currentSessionId && !pollingInterval) {
      startPolling();
    }
  }, [currentSessionId, pollingInterval, startPolling]);

  // Load saved sessions from local storage on mount
  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        const savedSessions = localStorage.getItem('attendanceSessions');
        if (savedSessions) {
          setSessions(JSON.parse(savedSessions));
        }
      } catch (err) {
        console.error('Failed to load sessions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSessions();
  }, []);

  // Save sessions to local storage when they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('attendanceSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusMap = {
      present: { color: 'bg-green-100 text-green-800', text: 'Present' },
      absent: { color: 'bg-red-100 text-red-800', text: 'Absent' },
      late: { color: 'bg-yellow-100 text-yellow-800', text: 'Late' },
      default: { color: 'bg-gray-100 text-gray-800', text: 'Unknown' }
    };
    
    const { color, text } = statusMap[status] || statusMap.default;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="select-students-container">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Facial Recognition Attendance
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {currentSession && (
              <button
                onClick={endCurrentSession}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
              >
                End Session
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Session */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentSession ? 'Current Session' : 'No Active Session'}
        </h2>
        
        {currentSession ? (
          <div className="student-table-container">
            <div className="p-4 border-b">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {currentSession.examName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {currentSession.examId} • {currentSession.metadata.course || 'No course'}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Started: {new Date(currentSession.startTime).toLocaleString()}
                </div>
              </div>
            </div>
            
            <table className="student-table">
              <thead className="student-table-header">
                <tr>
                  <th scope="col">
                    Reg Number
                  </th>
                  <th scope="col">
                    Name
                  </th>
                  <th scope="col">
                    Status
                  </th>
                  <th scope="col">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentSession.students.length > 0 ? (
                  currentSession.students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        {student.registrationNumber}
                      </td>
                      <td>
                        {student.name || 'N/A'}
                      </td>
                      <td>
                        <StatusBadge status={student.status} />
                      </td>
                      <td>
                        {new Date(student.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-students">
                      No students marked yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="px-4 py-3 bg-gray-50 text-right text-sm font-medium">
              <span className="text-gray-500">
                {currentSession.students.length} student{currentSession.students.length !== 1 ? 's' : ''} marked
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No active session</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click "Start New Session" to begin monitoring attendance
            </p>
            <button
              onClick={() => initNewSession({
                examId: 'manual-start',
                examName: 'Manual Session'
              })}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Start New Session
            </button>
          </div>
        )}
      </div>

      {/* Session History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Session History</h2>
        
        <div className="student-table-container">
          <table className="student-table">
            <thead className="student-table-header">
              <tr>
                <th scope="col">
                  Exam
                </th>
                <th scope="col">
                  Course
                </th>
                <th scope="col">
                  Period
                </th>
                <th scope="col">
                  Students
                </th>
                <th scope="col">
                  Status
                </th>
                <th scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr key={session.id} className={session.id === currentSessionId ? 'bg-blue-50' : ''}>
                    <td>
                      <div className="text-sm font-medium text-gray-900">{session.examName}</div>
                      <div className="text-sm text-gray-500">{session.examId}</div>
                    </td>
                    <td>
                      {session.metadata.course || 'N/A'}
                    </td>
                    <td>
                      <div>
                        {new Date(session.startTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {session.endTime 
                          ? `${new Date(session.startTime).toLocaleTimeString()} - ${new Date(session.endTime).toLocaleTimeString()}`
                          : 'Active'}
                      </div>
                    </td>
                    <td>
                      {session.students.length}
                    </td>
                    <td>
                      {session.endTime ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          // View session details
                          console.log('View session:', session);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          // Export session data
                          console.log('Export session:', session);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Export
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-students">
                    {isLoading ? 'Loading sessions...' : 'No attendance sessions recorded yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;