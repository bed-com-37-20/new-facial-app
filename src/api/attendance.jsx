import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import { useRegisterEvent } from '../hooks/api-calls/dataMutate';
import { 
  Button, 
  Card, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  CircularProgress,
  Chip,
  Divider,
  Typography
} from '@material-ui/core';
import { 
  PlayCircleFilled as StartIcon, 
  Stop as StopIcon, 
  History as HistoryIcon
} from '@material-ui/icons';
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        ou: ORG_UNIT_UID,
      }
    }
  };

  const { data: teiData, error: teiError, refetch: refetchTeis } = useDataQuery(teiQuery);
  const { registerEvent, loading: eventLoading } = useRegisterEvent();

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
  const startCameraSession = async (sessionId) => {
    try {
      const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/start-camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
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

  const findTei = (stNumber) => {
    return teiArray.find((ti) => stNumber === ti.regNumber);
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

      // Register events for present students
      await Promise.all(data.map(async (st) => {
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
              supervisor: session.metadata.supervisor,
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
    if (!teiData?.students?.trackedEntityInstances || !currentSessionId) return;

    const students = sessions.find(s => s.id === currentSessionId)?.students || [];

    const matches = teiData.students.trackedEntityInstances.filter(tei =>
      tei.attributes.some(attr =>
        attr.attribute === REG_NUM_ATTR_UID &&
        students.some(s => s.registrationNumber === attr.value)
      )
    );

    const matchedIds = matches.map(tei => tei.trackedEntityInstance);
    setMatchedTeiIds(matchedIds);
  }, [teiData, sessions, currentSessionId]);

  // Update teiArray whenever teiData changes
  useEffect(() => {
    if (teiData?.students?.trackedEntityInstances) {
      const extractedData = teiData.students.trackedEntityInstances.map(tei => {
        const regNumberAttr = tei.attributes.find(attr =>
          attr.attribute === REG_NUM_ATTR_UID || attr.code === 'regnumber'
        );

        const firstNameAttr = tei.attributes.find(attr =>
          attr.attribute === 'fname' || attr.code === 'fname'
        );

        const lastNameAttr = tei.attributes.find(attr =>
          attr.attribute === 'lname' || attr.code === 'lname'
        );

        return {
          entityInstanceId: tei.trackedEntityInstance,
          regNumber: regNumberAttr?.value || null,
          firstName: firstNameAttr?.value || null,
          lastName: lastNameAttr?.value || null,
        };
      });

      setTeiArray(extractedData);
    }
  }, [teiData]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusText = {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      default: 'Unknown'
    };
    return (
      <Chip 
        label={statusText[status] || statusText.default}
        color={status === 'present' ? 'primary' : status === 'absent' ? 'secondary' : 'default'}
        size="small"
      />
    );
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  // End attendance session
  const endAttendanceSession = async () => {
    try {
      setSessions(prev => prev.map(s =>
        s.id === currentSessionId ? { ...s, endTime: new Date().toISOString() } : s
      ));
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

  return (
    <div className="container">
      <div className="header">
        <div>
          <Typography variant="h4" component="h1">
            Attendance Monitoring
          </Typography>
          <Typography variant="subtitle1">
            {currentSession ? `Tracking: ${currentSession.examName}` : 'No active session'}
          </Typography>
        </div>
        <div>
          {currentSession ? (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<StopIcon />}
              onClick={endAttendanceSession}
              disabled={eventLoading}
            >
              {eventLoading ? <CircularProgress size={24} /> : 'End Session'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<StartIcon />}
              onClick={initNewSession}
            >
              Start Session
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert severity="error" style={{ marginBottom: 20 }}>
          {error}
        </Alert>
      )}

      <div className="tab-navigation">
        <Button
          onClick={() => setActiveTab('current')}
          color={activeTab === 'current' ? 'primary' : 'default'}
          startIcon={<StartIcon />}
        >
          Current Session
        </Button>
        <Button
          onClick={() => setActiveTab('history')}
          color={activeTab === 'history' ? 'primary' : 'default'}
          startIcon={<HistoryIcon />}
        >
          Session History
        </Button>
      </div>

      {activeTab === 'current' && currentSession && (
        <Card className="session-panel" style={{ padding: '20px', margin: '20px 0' }}>
          <div className="session-header">
            <Typography variant="h5" component="h2">
              {currentSession.examName}
            </Typography>
            <Chip 
              label="Active" 
              color="primary" 
              icon={<StartIcon />} 
            />
          </div>

          <Divider style={{ margin: '15px 0' }} />

          <div className="session-details">
            <Typography variant="body1">
              <strong>Course:</strong> {currentSession.metadata.course}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {new Date(currentSession.metadata.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">
              <strong>Room:</strong> {currentSession.metadata.room}
            </Typography>
            <Typography variant="body1">
              <strong>Supervisor:</strong> {currentSession.metadata.supervisor}
            </Typography>
            <Typography variant="body1">
              <strong>Time:</strong> {formatTime(currentSession.metadata.startTime)} - {formatTime(currentSession.metadata.endTime)}
            </Typography>
            <Typography variant="body1">
              <strong>Started at:</strong> {formatDateTime(currentSession.startTime)}
            </Typography>
            <Typography variant="body1">
              <strong>Students detected:</strong> {currentSession.students.length}
            </Typography>
          </div>

          <Divider style={{ margin: '15px 0' }} />

          <div className="matched-events">
            <Typography variant="h6" component="h3">
              Matched DHIS2 TEI IDs
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => refetchTeis()}
              style={{ margin: '10px 0' }}
            >
              Refresh Matches
            </Button>
            <ul>
              {matchedTeiIds.length > 0 ? (
                matchedTeiIds.map(id => <li key={id}>{id}</li>)
              ) : (
                <li>No matches found</li>
              )}
            </ul>
          </div>

          <Divider style={{ margin: '15px 0' }} />

          <div className="student-attendance">
            <Typography variant="h6" component="h3">
              Attendance List
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time Recorded</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentSession.students.length > 0 ? (
                  currentSession.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.registrationNumber}</TableCell>
                      <TableCell>
                        {teiArray.find(t => t.regNumber === student.registrationNumber)?.firstName || 'N/A'} 
                        {' '}
                        {teiArray.find(t => t.regNumber === student.registrationNumber)?.lastName || ''}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={student.status} />
                      </TableCell>
                      <TableCell>{formatDateTime(student.timestamp)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No students detected yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {activeTab === 'history' && (
        <div className="session-history">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exam</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <React.Fragment key={session.id}>
                    <TableRow>
                      <TableCell>{session.examName}</TableCell>
                      <TableCell>{session.metadata.course}</TableCell>
                      <TableCell>{new Date(session.metadata.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {formatDateTime(session.startTime)} to {session.endTime ? formatDateTime(session.endTime) : 'Ongoing'}
                      </TableCell>
                      <TableCell>{session.students.length}</TableCell>
                      <TableCell>
                        <Chip 
                          label={session.endTime ? 'Completed' : 'Active'} 
                          color={session.endTime ? 'default' : 'primary'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outlined"
                          onClick={() => {
                            setCurrentSessionId(session.id);
                            setActiveTab('current');
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                    {activeTab === 'history' && currentSessionId === session.id && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Card style={{ padding: '20px', margin: '10px 0' }}>
                            <Typography variant="h6" component="h4">
                              Session Details: {session.examName}
                            </Typography>
                            <Divider style={{ margin: '10px 0' }} />
                            <Typography variant="body1">
                              <strong>Room:</strong> {session.metadata.room}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Supervisor:</strong> {session.metadata.supervisor}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Scheduled Time:</strong> {formatTime(session.metadata.startTime)} - {formatTime(session.metadata.endTime)}
                            </Typography>
                            
                            <Divider style={{ margin: '15px 0' }} />
                            
                            <Typography variant="h6" component="h4">
                              Attendance Records ({session.students.length} students)
                            </Typography>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Student ID</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell>Time Recorded</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {session.students.length > 0 ? (
                                  session.students.map((student) => (
                                    <TableRow key={student.id}>
                                      <TableCell>{student.registrationNumber}</TableCell>
                                      <TableCell>
                                        {teiArray.find(t => t.regNumber === student.registrationNumber)?.firstName || 'N/A'} 
                                        {' '}
                                        {teiArray.find(t => t.regNumber === student.registrationNumber)?.lastName || ''}
                                      </TableCell>
                                      <TableCell>
                                        <StatusBadge status={student.status} />
                                      </TableCell>
                                      <TableCell>{formatDateTime(student.timestamp)}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} align="center">
                                      No attendance records
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No sessions available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Snackbar for notifications */}
      {snackbar.open && (
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          style={{ position: 'fixed', bottom: 20, right: 20 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </div>
  );
};

export default Attendance;