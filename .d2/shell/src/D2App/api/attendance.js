import React, { useEffect, useState, useCallback } from 'react';
import './Attendance.css';
import { useLocation } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
const Attendance = () => {
  // Load sessions from localStorage on initial render
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('attendance_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [viewingSessionId, setViewingSessionId] = useState(null); // Track which session is being viewed
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
    students,
    orgUnit
  } = location.state || {};

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
        ou: ORG_UNIT_UID
      }
    }
  };
  const {
    data: teiData,
    error: teiError,
    refetch: refetchTeis
  } = useDataQuery(teiQuery);

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
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Attendance Monitoring"), /*#__PURE__*/React.createElement("p", null, currentSession ? `Tracking: ${currentSession.examName}` : 'No active session')), /*#__PURE__*/React.createElement("div", null, currentSession ? /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSessions(prev => prev.map(s => s.id === currentSessionId ? {
        ...s,
        endTime: new Date().toISOString()
      } : s));
      setCurrentSessionId(null);
    },
    className: "end-session"
  }, "End Session") : /*#__PURE__*/React.createElement("button", {
    onClick: () => initNewSession({
      examId: courseName.replace(/\s+/g, '_') + '_' + Date.now(),
      examName: courseName,
      room: room,
      supervisor: supervisorName,
      course: courseName
    }),
    className: "start-session"
  }, "Start Session"))), error && /*#__PURE__*/React.createElement("div", {
    className: "error-message"
  }, /*#__PURE__*/React.createElement("span", null, error)), /*#__PURE__*/React.createElement("div", {
    className: "tab-navigation"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('current');
      setViewingSessionId(null); // Clear viewing when switching tabs
    },

    className: activeTab === 'current' ? 'active' : '',
    style: {
      color: 'black'
    }
  }, "Current Session"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('history'),
    className: activeTab === 'history' ? 'active' : '',
    style: {
      color: 'black'
    }
  }, "Session History")), activeTab === 'current' && currentSession && /*#__PURE__*/React.createElement("div", {
    className: "matched-events"
  }, /*#__PURE__*/React.createElement("h3", null, "Matched DHIS2 TEI IDs"), /*#__PURE__*/React.createElement("button", {
    onClick: () => refetchTeis()
  }, "Refresh Matches"), /*#__PURE__*/React.createElement("ul", null, matchedTeiIds.length > 0 ? matchedTeiIds.map(id => /*#__PURE__*/React.createElement("li", {
    key: id
  }, id)) : /*#__PURE__*/React.createElement("li", null, "No matches found"))), activeTab === 'history' && /*#__PURE__*/React.createElement("div", {
    className: "session-history"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Exam"), /*#__PURE__*/React.createElement("th", null, "Course"), /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Duration"), /*#__PURE__*/React.createElement("th", null, "Students"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, sessions.length > 0 ? sessions.map(session => /*#__PURE__*/React.createElement(React.Fragment, {
    key: session.id
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, session.examName), /*#__PURE__*/React.createElement("td", null, session.metadata.course || 'N/A'), /*#__PURE__*/React.createElement("td", null, session.metadata.date || 'N/A'), /*#__PURE__*/React.createElement("td", null, session.startTime && session.endTime ? `${Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000)} mins` : 'N/A'), /*#__PURE__*/React.createElement("td", null, session.students.length), /*#__PURE__*/React.createElement("td", null, session.endTime ? 'Completed' : 'Active'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewingSessionId(session.id)
  }, "View"))), viewingSessionId === session.id && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "7"
  }, /*#__PURE__*/React.createElement("div", {
    className: "session-details"
  }, /*#__PURE__*/React.createElement("h4", null, "Attendance Details for ", session.examName), /*#__PURE__*/React.createElement("table", {
    className: "student-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Student ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Time Recorded"))), /*#__PURE__*/React.createElement("tbody", null, session.students.length > 0 ? session.students.map(student => /*#__PURE__*/React.createElement("tr", {
    key: student.id
  }, /*#__PURE__*/React.createElement("td", null, student.registrationNumber), /*#__PURE__*/React.createElement("td", null, student.name || 'N/A'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
    status: student.status
  })), /*#__PURE__*/React.createElement("td", null, formatDateTime(student.timestamp)))) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "4"
  }, "No attendance records")))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewingSessionId(null),
    className: "close-details"
  }, "Close Details")))))) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "7"
  }, "No sessions available"))))));
};
export default Attendance;