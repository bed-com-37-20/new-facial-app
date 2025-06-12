import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';
import CourseDisplay from './displayCourse';

const Report = () => {
    const location = useLocation();
    const { exam } = location.state || {};
    const [showStudents, setShowStudents] = useState(false);
    const [students, setStudents] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // Fetch courses from local storage instead of API
    useEffect(() => {
        const fetchCoursesFromLocalStorage = () => {
            setLoadingHistory(true);
            try {
                const storedSessions = JSON.parse(localStorage.getItem('attendanceSessions') || '[]');

                // Transform the stored sessions to match the expected format
                const formattedCourses = storedSessions.map(session => ({
                    id: session.id,
                    examName: session.metadata.courseName,
                    date: session.metadata.date,
                    startTime: session.metadata.startTime,
                    endTime: session.metadata.endTime,
                    room: session.metadata.room,
                    supervisor: session.metadata.supervisor,
                    students: session.students.length > 0 ?
                        session.students.map(student => ({
                            name: student.name || 'N/A',
                            registrationNumber: student.registrationNumber,
                            status: student.status
                        })) :
                        session.metadata.selectedStudents.map(regNumber => ({
                            name: 'N/A',
                            registrationNumber: regNumber,
                            status: 'absent'
                        }))
                }));

                setStudents(formattedCourses);
                setLoadingHistory(false);
            } catch (error) {
                console.error('Error loading courses from local storage:', error);
                setStudents([]);
                setLoadingHistory(false);
            }
        };

        fetchCoursesFromLocalStorage();
    }, []);

    if (!exam) {
        if (loadingHistory) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    gap: '10px',
                    marginTop: '25%'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        animation: 'spin 1s linear infinite',
                    }}></div>
                    <p style={{
                        fontSize: '18px',
                        color: '#3498db',
                        textAlign: 'center',
                        margin: 0
                    }}>Loading...</p>
                </div>
            );
        }

        return <CourseDisplay courses={students} />;
    }

    const handleViewAllClick = () => {
        setShowStudents(!showStudents);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        console.log("Exam changed:", exam);
    }, [exam]);

    return (
        <div className="report-container">
            <div className="report-header">
                <h1 style={{ color: 'black' }}>Exam Report Summary</h1>
                <div className="exam-meta">
                    <span className="exam-course" style={{ color: 'black' }}>{exam.examName}</span>
                    <span className="exam-date" style={{ color: 'black' }}>{formatDate(exam.date)}</span>
                </div>
            </div>

            <div className="exam-details-grid">
                <div className="detail-card">
                    <h3>Supervisor</h3>
                    <p>{exam.supervisor}</p>
                </div>
                <div className="detail-card">
                    <h3>Time</h3>
                    <p>{exam.startTime} - {exam.endTime}</p>
                </div>
                <div className="detail-card">
                    <h3>Room</h3>
                    <p>{exam.room}</p>
                </div>
            </div>

            <div className="fulltable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 style={{ color: 'black' }}>Students for {exam.examName}</h2>
                        <p>Total : {exam.students.length}</p>
                    </div>
                    <div className="students-table-container">
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Registration Number</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exam.students.map((student, index) => (
                                    <tr key={index}>
                                        <td style={{ fontSize: "18px" }}>{index + 1}</td>
                                        <td style={{ fontSize: "18px" }}>{student.name}</td>
                                        <td style={{ fontSize: "18px" }}>{student.registrationNumber}</td>
                                        <td style={{ color: student.status === 'absent' ? 'red' : 'green' }}>
                                            <p style={{ fontSize: "18px" }}>{student.status}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showSuccessAlert && (
                <div className="success-alert">
                    Exam created successfully for students!
                </div>
            )}
        </div>
    );
};

export default Report;