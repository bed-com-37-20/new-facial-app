import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import { useRegisterEvent } from '../hooks/api-calls/dataMutate';
import { Button, Card, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Chip, Divider, Typography } from '@material-ui/core';
import { PlayCircleFilled as StartIcon, Stop as StopIcon, History as HistoryIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
const PROGRAM_ID = 'TLvAWiCKRgq';
const REG_NUM_ATTR_UID = 'ofiRHvsg4Mt';
const Attendance = () => {
  // Persist sessions and currentSessionId in localStorage
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('attendance_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem('attendance_currentSessionId');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [refreshInterval] = useState(5000);
  const [matchedTeiIds, setMatchedTeiIds] = useState([]);
  const [teiArray, setTeiArray] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const location = useLocation();
  const examData = location.state || {};

  // Save sessions and currentSessionId to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('attendance_sessions', JSON.stringify(sessions));
  }, [sessions]);
  useEffect(() => {
    localStorage.setItem('attendance_currentSessionId', JSON.stringify(currentSessionId));
  }, [currentSessionId]);

  // Get current session
  const currentSession = sessions.find(session => session.id === currentSessionId);
  const ORG_UNIT_UID = examData.orgUnit;

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
  const {
    registerEvent,
    loading: eventLoading
  } = useRegisterEvent();

  // Initialize a new session with exam data
  const initNewSession = useCallback(() => {
    if (!examData.courseName) {
      setSnackbar({
        open: true,
        message: 'No exam data available to start session',
        severity: 'warning'
      });
      return null;
    }
    const newSession = {
      id: `session_${Date.now()}`,
      examId: examData.courseName.replace(/\s+/g, '_') + '_' + Date.now(),
      examName: examData.courseName,
      startTime: new Date().toISOString(),
      endTime: null,
      students: [],
      metadata: {
        room: examData.room,
        supervisor: examData.supervisorName,
        course: examData.courseName,
        date: examData.date,
        startTime: examData.startTime,
        endTime: examData.endTime,
        orgUnit: examData.orgUnit,
        selectedStudents: examData.students || []
      }
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setActiveTab('current');

    // Start camera session
    startCameraSession(newSession.id);
    return newSession;
  }, [examData]);

  // Start camera session
  const startCameraSession = async sessionId => {
    try {
      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/start-camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId
        })
      });
      if (!response.ok) {
        throw new Error('Failed to start camera session');
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Camera error: ${err.message}`,
        severity: 'error'
      });
    }
  };
  const findTei = stNumber => {
    return teiArray.find(ti => stNumber === ti.regNumber);
  };

  // Fetch attendance data
  const fetchAttendanceData = useCallback(async () => {
    try {
      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance');
      if (!response.ok) {
        throw new Error('There is error from server..');
      }
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

      // Register events for present students
      await Promise.all(data.map(async st => {
        if (st.status !== "absent") {
          const teiId = findTei(st.registrationNumber);
          if (teiId) {
            const Id = teiId.entityInstanceId;
            const session = sessions.find(s => s.id === currentSessionId);
            const eventData = {
              trackedEntityInstance: Id,
              program: PROGRAM_ID,
              orgUnit: session.metadata.orgUnit,
              programStage: PROGRAM_ID,
              attendance: 'Present',
              startTime: session.metadata.startTime,
              endTime: session.metadata.endTime,
              date: session.metadata.date,
              courseName: session.metadata.course,
              examRoom: session.metadata.room,
              supervisor: session.metadata.supervisor
            };
            try {
              const result = await registerEvent(eventData);
              console.log('Event registered:', result);
            } catch (err) {
              console.error('Error registering event:', err);
            }
          }
        }
      }));
    } catch (err) {
      setError(`Failed to fetch attendance data: ${err.message}`);
      console.error('Error fetching attendance data:', err);
    }
  }, [currentSessionId, sessions, registerEvent]);

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
    var _teiData$students, _sessions$find;
    if (!(teiData !== null && teiData !== void 0 && (_teiData$students = teiData.students) !== null && _teiData$students !== void 0 && _teiData$students.trackedEntityInstances) || !currentSessionId) return;
    const students = ((_sessions$find = sessions.find(s => s.id === currentSessionId)) === null || _sessions$find === void 0 ? void 0 : _sessions$find.students) || [];
    const matches = teiData.students.trackedEntityInstances.filter(tei => tei.attributes.some(attr => attr.attribute === REG_NUM_ATTR_UID && students.some(s => s.registrationNumber === attr.value)));
    const matchedIds = matches.map(tei => tei.trackedEntityInstance);
    setMatchedTeiIds(matchedIds);
  }, [teiData, sessions, currentSessionId]);

  // Update teiArray whenever teiData changes
  useEffect(() => {
    var _teiData$students2;
    if (teiData !== null && teiData !== void 0 && (_teiData$students2 = teiData.students) !== null && _teiData$students2 !== void 0 && _teiData$students2.trackedEntityInstances) {
      const extractedData = teiData.students.trackedEntityInstances.map(tei => {
        const regNumberAttr = tei.attributes.find(attr => attr.attribute === REG_NUM_ATTR_UID || attr.code === 'regnumber');
        const firstNameAttr = tei.attributes.find(attr => attr.attribute === 'fname' || attr.code === 'fname');
        const lastNameAttr = tei.attributes.find(attr => attr.attribute === 'lname' || attr.code === 'lname');
        return {
          entityInstanceId: tei.trackedEntityInstance,
          regNumber: (regNumberAttr === null || regNumberAttr === void 0 ? void 0 : regNumberAttr.value) || null,
          firstName: (firstNameAttr === null || firstNameAttr === void 0 ? void 0 : firstNameAttr.value) || null,
          lastName: (lastNameAttr === null || lastNameAttr === void 0 ? void 0 : lastNameAttr.value) || null
        };
      });
      setTeiArray(extractedData);
    }
  }, [teiData]);

  // Status badge component
  const StatusBadge = _ref => {
    let {
      status
    } = _ref;
    const statusText = {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      default: 'Unknown'
    };
    return /*#__PURE__*/React.createElement(Chip, {
      label: statusText[status] || statusText.default,
      color: status === 'present' ? 'primary' : status === 'absent' ? 'secondary' : 'default',
      size: "small"
    });
  };
  const formatDateTime = isoString => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  const formatTime = timeString => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  // End attendance session
  const endAttendanceSession = async () => {
    try {
      setSessions(prev => prev.map(s => s.id === currentSessionId ? {
        ...s,
        endTime: new Date().toISOString()
      } : s));
      setCurrentSessionId(null);
      setSnackbar({
        open: true,
        message: 'Attendance session ended successfully!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to end attendance session',
        severity: 'error'
      });
      console.error('Error ending attendance session:', err);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Typography, {
    variant: "h4",
    component: "h1"
  }, "Attendance Monitoring"), /*#__PURE__*/React.createElement(Typography, {
    variant: "subtitle1"
  }, currentSession ? `Tracking: ${currentSession.examName}` : 'No active session')), /*#__PURE__*/React.createElement("div", null, currentSession ? /*#__PURE__*/React.createElement(Button, {
    variant: "contained",
    color: "secondary",
    startIcon: /*#__PURE__*/React.createElement(StopIcon, null),
    onClick: endAttendanceSession,
    disabled: eventLoading
  }, eventLoading ? /*#__PURE__*/React.createElement(CircularProgress, {
    size: 24
  }) : 'End Session') : /*#__PURE__*/React.createElement(Button, {
    variant: "contained",
    color: "primary",
    startIcon: /*#__PURE__*/React.createElement(StartIcon, null),
    onClick: initNewSession
  }, "Start Session"))), error && /*#__PURE__*/React.createElement(Alert, {
    severity: "error",
    style: {
      marginBottom: 20
    }
  }, error), /*#__PURE__*/React.createElement("div", {
    className: "tab-navigation"
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setActiveTab('current'),
    color: activeTab === 'current' ? 'primary' : 'default',
    startIcon: /*#__PURE__*/React.createElement(StartIcon, null)
  }, "Current Session"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setActiveTab('history'),
    color: activeTab === 'history' ? 'primary' : 'default',
    startIcon: /*#__PURE__*/React.createElement(HistoryIcon, null)
  }, "Session History")), activeTab === 'current' && currentSession && /*#__PURE__*/React.createElement(Card, {
    className: "session-panel",
    style: {
      padding: '20px',
      margin: '20px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "session-header"
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h5",
    component: "h2"
  }, currentSession.examName), /*#__PURE__*/React.createElement(Chip, {
    label: "Active",
    color: "primary",
    icon: /*#__PURE__*/React.createElement(StartIcon, null)
  })), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: '15px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "session-details"
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Course:"), " ", currentSession.metadata.course), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Date:"), " ", new Date(currentSession.metadata.date).toLocaleDateString()), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Room:"), " ", currentSession.metadata.room), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Supervisor:"), " ", currentSession.metadata.supervisor), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Time:"), " ", formatTime(currentSession.metadata.startTime), " - ", formatTime(currentSession.metadata.endTime)), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Started at:"), " ", formatDateTime(currentSession.startTime)), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Students detected:"), " ", currentSession.students.length)), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: '15px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "matched-events"
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    component: "h3"
  }, "Matched DHIS2 TEI IDs"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    onClick: () => refetchTeis(),
    style: {
      margin: '10px 0'
    }
  }, "Refresh Matches"), /*#__PURE__*/React.createElement("ul", null, matchedTeiIds.length > 0 ? matchedTeiIds.map(id => /*#__PURE__*/React.createElement("li", {
    key: id
  }, id)) : /*#__PURE__*/React.createElement("li", null, "No matches found"))), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: '15px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "student-attendance"
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    component: "h3"
  }, "Attendance List"), /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Student ID"), /*#__PURE__*/React.createElement(TableCell, null, "Name"), /*#__PURE__*/React.createElement(TableCell, null, "Status"), /*#__PURE__*/React.createElement(TableCell, null, "Time Recorded"))), /*#__PURE__*/React.createElement(TableBody, null, currentSession.students.length > 0 ? currentSession.students.map(student => {
    var _teiArray$find, _teiArray$find2;
    return /*#__PURE__*/React.createElement(TableRow, {
      key: student.id
    }, /*#__PURE__*/React.createElement(TableCell, null, student.registrationNumber), /*#__PURE__*/React.createElement(TableCell, null, ((_teiArray$find = teiArray.find(t => t.regNumber === student.registrationNumber)) === null || _teiArray$find === void 0 ? void 0 : _teiArray$find.firstName) || 'N/A', ' ', ((_teiArray$find2 = teiArray.find(t => t.regNumber === student.registrationNumber)) === null || _teiArray$find2 === void 0 ? void 0 : _teiArray$find2.lastName) || ''), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(StatusBadge, {
      status: student.status
    })), /*#__PURE__*/React.createElement(TableCell, null, formatDateTime(student.timestamp)));
  }) : /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    colSpan: 4,
    align: "center"
  }, "No students detected yet")))))), activeTab === 'history' && /*#__PURE__*/React.createElement("div", {
    className: "session-history"
  }, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Exam"), /*#__PURE__*/React.createElement(TableCell, null, "Course"), /*#__PURE__*/React.createElement(TableCell, null, "Date"), /*#__PURE__*/React.createElement(TableCell, null, "Duration"), /*#__PURE__*/React.createElement(TableCell, null, "Students"), /*#__PURE__*/React.createElement(TableCell, null, "Status"), /*#__PURE__*/React.createElement(TableCell, null, "Actions"))), /*#__PURE__*/React.createElement(TableBody, null, sessions.length > 0 ? sessions.map(session => /*#__PURE__*/React.createElement(React.Fragment, {
    key: session.id
  }, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, session.examName), /*#__PURE__*/React.createElement(TableCell, null, session.metadata.course), /*#__PURE__*/React.createElement(TableCell, null, new Date(session.metadata.date).toLocaleDateString()), /*#__PURE__*/React.createElement(TableCell, null, formatDateTime(session.startTime), " to ", session.endTime ? formatDateTime(session.endTime) : 'Ongoing'), /*#__PURE__*/React.createElement(TableCell, null, session.students.length), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(Chip, {
    label: session.endTime ? 'Completed' : 'Active',
    color: session.endTime ? 'default' : 'primary',
    size: "small"
  })), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    onClick: () => {
      setCurrentSessionId(session.id);
      setActiveTab('current');
    }
  }, "View Details"))), activeTab === 'history' && currentSessionId === session.id && /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    colSpan: 7
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: '20px',
      margin: '10px 0'
    }
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    component: "h4"
  }, "Session Details: ", session.examName), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: '10px 0'
    }
  }), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Room:"), " ", session.metadata.room), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Supervisor:"), " ", session.metadata.supervisor), /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, /*#__PURE__*/React.createElement("strong", null, "Scheduled Time:"), " ", formatTime(session.metadata.startTime), " - ", formatTime(session.metadata.endTime)), /*#__PURE__*/React.createElement(Divider, {
    style: {
      margin: '15px 0'
    }
  }), /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    component: "h4"
  }, "Attendance Records (", session.students.length, " students)"), /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, null, "Student ID"), /*#__PURE__*/React.createElement(TableCell, null, "Name"), /*#__PURE__*/React.createElement(TableCell, null, "Status"), /*#__PURE__*/React.createElement(TableCell, null, "Time Recorded"))), /*#__PURE__*/React.createElement(TableBody, null, session.students.length > 0 ? session.students.map(student => {
    var _teiArray$find3, _teiArray$find4;
    return /*#__PURE__*/React.createElement(TableRow, {
      key: student.id
    }, /*#__PURE__*/React.createElement(TableCell, null, student.registrationNumber), /*#__PURE__*/React.createElement(TableCell, null, ((_teiArray$find3 = teiArray.find(t => t.regNumber === student.registrationNumber)) === null || _teiArray$find3 === void 0 ? void 0 : _teiArray$find3.firstName) || 'N/A', ' ', ((_teiArray$find4 = teiArray.find(t => t.regNumber === student.registrationNumber)) === null || _teiArray$find4 === void 0 ? void 0 : _teiArray$find4.lastName) || ''), /*#__PURE__*/React.createElement(TableCell, null, /*#__PURE__*/React.createElement(StatusBadge, {
      status: student.status
    })), /*#__PURE__*/React.createElement(TableCell, null, formatDateTime(student.timestamp)));
  }) : /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    colSpan: 4,
    align: "center"
  }, "No attendance records"))))))))) : /*#__PURE__*/React.createElement(TableRow, null, /*#__PURE__*/React.createElement(TableCell, {
    colSpan: 7,
    align: "center"
  }, "No sessions available"))))), snackbar.open && /*#__PURE__*/React.createElement(Alert, {
    severity: snackbar.severity,
    onClose: () => setSnackbar({
      ...snackbar,
      open: false
    }),
    style: {
      position: 'fixed',
      bottom: 20,
      right: 20
    }
  }, snackbar.message));
};
export default Attendance;