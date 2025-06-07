import React, { useEffect, useState, useCallback } from 'react';
import './Attendance.css';
import { useLocation } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import { markAllAbsent, camera } from './Attendance/hooks';
const Attendance = () => {
  const [sessions, setSessions] = useState([]);
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
  } = location.state;
  const AB_END_POINT = 'https://facial-attendance-system-6vy8.onrender.com/attendance/mark-all-absent';
  const CAMERA_START = 'https://facial-attendance-system-6vy8.onrender.com/face/recognize';

  // Get current session
  const currentSession = sessions.find(session => session.id === currentSessionId);
  // Get the session being viewed
  const viewingSession = sessions.find(session => session.id === viewingSessionId);

  // const PROGRAM_ID = 'TLvAWiCKRgq';
  // const REG_NUM_ATTR_UID = 'ofiRHvsg4Mt';
  // const ORG_UNIT_UID = orgUnit;

  // // DHIS2 query for tracked entity instances
  // const teiQuery = {
  //   students: {
  //     resource: 'trackedEntityInstances',
  //     params: {
  //       ou: ORG_UNIT_UID,
  //     }
  //   }
  // };

  // const { data: teiData, error: teiError, refetch: refetchTeis } = useDataQuery(teiQuery);

  // Initialize a new session
  const initNewSession = useCallback(sessionData => {
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
  const findTei = stNumber => {
    return teiArray.find(ti => stNumber === ti.regNumber);
  };

  // Fetch attendance data
  const fetchAttendanceData = useCallback(async () => {
    const data = camera(CAMERA_START);
    try {
      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance');
      if (!response.ok) {
        alert('There is error from server..');
      }
      ;
      const data = await response.json();
      if (data && data.length > 0 && currentSessionId) {
        setSessions(prev => prev.map(session => {
          if (session.id === currentSessionId) {
            const newStudents = data.filter(newStudent => !session.students.some(existing => existing.registrationNumber === newStudent.registrationNumber)).map(student => ({
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
  const StatusBadge = _ref => {
    let {
      status
    } = _ref;
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
    return /*#__PURE__*/React.createElement("span", {
      className: statusClasses[status] || statusClasses.default
    }, statusText[status] || statusText.default);
  };
  const formatDateTime = isoString => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  useEffect(() => {
    console.log('Current Session:', students);
  }, [students]);
  return /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "header",
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "h1",
    style: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333'
    }
  }, "Attendance Monitoring"), /*#__PURE__*/React.createElement("p", {
    className: "p",
    style: {
      fontSize: '16px',
      color: '#666'
    }
  }, currentSession ? `Tracking: ${currentSession.examName}` : 'No active session')), /*#__PURE__*/React.createElement("div", null, currentSession ? /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSessions(prev => prev.map(s => s.id === currentSessionId ? {
        ...s,
        endTime: new Date().toISOString()
      } : s));
      setCurrentSessionId(null);
    },
    className: "end-session",
    style: {
      padding: '10px 20px',
      backgroundColor: '#e74c3c',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  }, "End Session") : /*#__PURE__*/React.createElement("button", {
    onClick: async () => {
      const data = await markAllAbsent(AB_END_POINT);
      initNewSession({
        examId: courseName.replace(/\s+/g, '_') + '_' + Date.now(),
        examName: courseName,
        room: room,
        supervisor: supervisorName,
        course: courseName
      });
    },
    className: "start-session",
    style: {
      padding: '10px 20px',
      backgroundColor: '#2ecc71',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  }, "Start Session"))), error && /*#__PURE__*/React.createElement("div", {
    className: "error-message",
    style: {
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "span"
  }, error)), /*#__PURE__*/React.createElement("div", {
    className: "tab-navigation",
    style: {
      display: 'flex',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('current');
      setViewingSessionId(null);
    },
    className: activeTab === 'current' ? 'active' : '',
    style: {
      flex: 1,
      padding: '10px',
      backgroundColor: activeTab === 'current' ? '#3498db' : '#ecf0f1',
      color: activeTab === 'current' ? '#fff' : '#333',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '10px'
    }
  }, "Current Session"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('history'),
    className: activeTab === 'history' ? 'active' : '',
    style: {
      flex: 1,
      padding: '10px',
      backgroundColor: activeTab === 'history' ? '#3498db' : '#ecf0f1',
      color: activeTab === 'history' ? '#fff' : '#333',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  }, "Session History")), activeTab === 'current' && currentSession && /*#__PURE__*/React.createElement("div", {
    className: "current-session",
    style: {
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h2",
    style: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    }
  }, currentSession.examName), /*#__PURE__*/React.createElement("div", {
    className: "session-meta",
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "p",
    style: {
      fontSize: '16px',
      color: '#666'
    }
  }, "Room: ", currentSession.metadata.room), /*#__PURE__*/React.createElement("p", {
    className: "p",
    style: {
      fontSize: '16px',
      color: '#666'
    }
  }, "Supervisor: ", currentSession.metadata.supervisor), /*#__PURE__*/React.createElement("p", {
    className: "p",
    style: {
      fontSize: '16px',
      color: '#666'
    }
  }, "Started: ", formatDateTime(currentSession.startTime))), /*#__PURE__*/React.createElement("div", {
    className: "attendance-table",
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "table",
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", {
    className: "thead",
    style: {
      backgroundColor: '#3498db',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("tr", {
    className: "tr"
  }, /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Student ID"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Name"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Time Recorded"))), /*#__PURE__*/React.createElement("tbody", {
    className: "tbody"
  }, currentSession.students.length > 0 ? currentSession.students.map(student => /*#__PURE__*/React.createElement("tr", {
    className: "tr",
    key: student.id,
    style: {
      borderBottom: '1px solid #ddd'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, student.registrationNumber), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, student.name || 'N/A'), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: student.status
  })), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, formatDateTime(student.timestamp)))) : /*#__PURE__*/React.createElement("tr", {
    className: "tr"
  }, /*#__PURE__*/React.createElement("td", {
    className: "td",
    colSpan: "4",
    style: {
      padding: '10px',
      textAlign: 'center',
      color: '#666'
    }
  }, "No attendance records yet")))))), activeTab === 'history' && /*#__PURE__*/React.createElement("div", {
    className: "session-history",
    style: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: "sessions-table",
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", {
    className: "thead",
    style: {
      backgroundColor: '#3498db',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("tr", {
    className: "tr"
  }, /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Exam"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Course"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Date"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Duration"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Students"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", {
    className: "tbody"
  }, sessions.length > 0 ? sessions.map(session => /*#__PURE__*/React.createElement(React.Fragment, {
    key: session.id
  }, /*#__PURE__*/React.createElement("tr", {
    className: "tr",
    style: {
      borderBottom: '1px solid #ddd'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, session.examName), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, session.metadata.course || 'N/A'), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, session.metadata.date || 'N/A'), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, session.startTime && session.endTime ? `${Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)} mins` : 'N/A'), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, session.students.length), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, session.endTime ? 'Completed' : 'Active'), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "button",
    onClick: () => setViewingSessionId(session.id),
    style: {
      padding: '5px 10px',
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  }, "View"))), viewingSessionId === session.id && /*#__PURE__*/React.createElement("tr", {
    className: "tr"
  }, /*#__PURE__*/React.createElement("td", {
    className: "td",
    colSpan: "7",
    style: {
      padding: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "session-details",
    style: {
      padding: '20px',
      backgroundColor: '#ecf0f1',
      borderRadius: '8px'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    className: "h4",
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    }
  }, "Attendance Details for ", session.examName), /*#__PURE__*/React.createElement("table", {
    className: "student-details-table",
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", {
    className: "thead",
    style: {
      backgroundColor: '#3498db',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("tr", {
    className: "tr"
  }, /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Student ID"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Name"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "th",
    style: {
      padding: '10px',
      textAlign: 'left'
    }
  }, "Time Recorded"))), /*#__PURE__*/React.createElement("tbody", {
    className: "tbody"
  }, session.students.length > 0 ? session.students.map(student => /*#__PURE__*/React.createElement("tr", {
    className: "tr",
    key: student.id,
    style: {
      borderBottom: '1px solid #ddd'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, student.registrationNumber), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, student.name || 'N/A'), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: student.status
  })), /*#__PURE__*/React.createElement("td", {
    className: "td",
    style: {
      padding: '10px'
    }
  }, formatDateTime(student.timestamp)))) : /*#__PURE__*/React.createElement("tr", {
    className: "tr"
  }, /*#__PURE__*/React.createElement("td", {
    className: "td",
    colSpan: "4",
    style: {
      padding: '10px',
      textAlign: 'center',
      color: '#666'
    }
  }, "No attendance records")))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewingSessionId(null),
    className: "close-details",
    style: {
      padding: '10px 20px',
      backgroundColor: '#e74c3c',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px'
    }
  }, "Close Details")))))) : /*#__PURE__*/React.createElement("tr", {
    className: "tr"
  }, /*#__PURE__*/React.createElement("td", {
    className: "td",
    colSpan: "7",
    style: {
      padding: '10px',
      textAlign: 'center',
      color: '#666'
    }
  }, "No sessions available"))))));
};
export default Attendance;