import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataQuery } from '@dhis2/app-runtime';
import { Divider } from '@material-ui/core';
import './exam.css';
import { Trash } from 'lucide-react';

const ORG_UNITS_QUERY = {
    orgUnits: {
        resource: 'organisationUnits',
        params: {
            paging: false,
            fields: 'id,name,level',
            order: 'level:asc,name:asc',
        },
    },
};

const STUDENTS_QUERY = {
    students: {
        resource: 'trackedEntityInstances',
        params: ({ orgUnitId }) => ({
            ou: orgUnitId,
        }),
    },
};

const NewExam = () => {
    const [filter, setFilter] = useState('');
    const [exams, setExams] = useState([]);
    const [newExam, setNewExam] = useState({
        courseName: '',
        date: '',
        room: '',
        supervisorName: '',
        startTime: '',
        endTime: '',
    });
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showStudentSelection, setShowStudentSelection] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoursesFromLocalStorage = () => {
            try {
                // Get stored sessions from local storage
                const storedSessions = JSON.parse(localStorage.getItem('attendanceSessions') || []);

                // Transform the stored sessions to match the expected exams format
                const formattedExams = storedSessions.map(session => ({
                    id: session.id,
                    examName: session.metadata.courseName,
                    date: session.metadata.date,
                    startTime: session.metadata.startTime,
                    endTime: session.metadata.endTime,
                    room: session.metadata.room,
                    supervisor: session.metadata.supervisor,
                    students: session.students.length > 0
                        ? session.students.map(student => ({
                            name: student.name || 'N/A',
                            registrationNumber: student.registrationNumber,
                            status: student.status
                        }))
                        : session.metadata.selectedStudents.map(regNumber => ({
                            name: 'N/A',
                            registrationNumber: regNumber,
                            status: 'absent'
                        }))
                }));

                setExams(formattedExams);
            } catch (error) {
                console.error('Error loading courses from local storage:', error);
                setExams([]);
            }
        };

        fetchCoursesFromLocalStorage();
    }, []);

    const { data: orgUnitData } = useDataQuery(ORG_UNITS_QUERY);
    const { data: studentData, refetch: refetchStudents } = useDataQuery(STUDENTS_QUERY, {
        lazy: true,
        variables: { orgUnitId: selectedOrgUnit },
    });

    useEffect(() => {
        // console.log(exams)
        if (selectedOrgUnit) {
            refetchStudents({ orgUnitId: selectedOrgUnit });
        }
    }, [selectedOrgUnit, refetchStudents]);

    const orgUnits = orgUnitData?.orgUnits?.organisationUnits || [];
    const students = studentData?.students?.trackedEntityInstances || [];

    const filteredExams = exams.filter(
        (exam) =>
            exam.examName?.toLowerCase().includes(filter.toLowerCase()) ||
            exam.date?.includes(filter)
    );

    const filteredStudents = students.filter((student) => {
        const firstName = student.attributes.find((attr) => attr.code === 'fname')?.value || '';
        const lastName = student.attributes.find((attr) => attr.code === 'lname')?.value || '';
        const program = student.attributes.find((attr) => attr.code === 'program of study')?.value || '';
        const regNumber = student.attributes.find((attr) => attr.code === 'regnumber')?.value || '';

        const searchLower = searchTerm.toLowerCase();
        const fullName = `${firstName} ${lastName}`.toLowerCase();

        return (
            fullName.includes(searchLower) ||
            program.toLowerCase().includes(searchLower) ||
            regNumber.toLowerCase().includes(searchLower)
        );
    });

    const handleCreateExam = () => {
        navigate('/api/examPage/ExamForm');
    };

    const handleFinalSubmit = () => {
        const examData = {
            ...newExam,
            students: selectedStudents,
            orgUnit: selectedOrgUnit,
        };
        console.log('Final Exam Data:', examData);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 2000);
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
        );
    };


    const getAttendanceStatus = (exam) => {
        if (!exam.students) return 'No students registered';
        const presentCount = exam.students.filter(s => s.status === 'present').length;
        return `${presentCount}/${exam.students.length} students present`;
    };

    return (
        <div className="exam-container">
            {!showStudentSelection ? (
                <>
                    <div className="header">
                        <h1>Exam Summary</h1>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by exam name or date..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                            <button className="primary-btn" onClick={handleCreateExam} style={{backgroundColor: 'blue', color: 'white',}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                                New
                            </button>
                        </div>
                    </div>
                    <Divider />
                    <p>Below is a summary of past exams. You can view details or create a new exam using the options provided.</p>
                    <div className="card-container">
                        {filteredExams.length > 0 ? (
                            filteredExams.map((exam) => (
                                <div key={exam.id} className="exam-card">
                                    <div style={{ display: 'flex', flexDirection:'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <h3 style={{ color: 'black'}}>{exam.examName}</h3>
                                    <button
                                       style={{color:'red', background: 'none', border: 'none', cursor: 'pointer',margin: '0 10px' }}
                                        onClick={() => {
                                            // Add delete functionality here
                                            const deleteExam = async (examId) => {


                                                const myHeaders = new Headers();
                                                myHeaders.append("Content-Type", "application/json");

                                                const raw = JSON.stringify({
                                                    "ids": [
                                                        examId
                                                    ]
                                                });

                                                const requestOptions = {
                                                    method: "DELETE",
                                                    headers: myHeaders,
                                                    body: raw,
                                                    redirect: "follow"
                                                };

                                                fetch("https://facial-attendance-system-6vy8.onrender.com/attendance/deleteCourse", requestOptions)
                                                    .then((response) => response.text())
                                                    .then((result) => {
                                                        console.log(result);
                                                        alert('Exam deleted successfully!');
                                                        setExams((prevExams) => prevExams.filter((exam) => exam.id !== examId));
                                                    })
                                                    .catch((error) => {
                                                        console.error('Error deleting exam:', error);
                                                        alert('Failed to delete exam. Please try again.');
                                                    });

                                                console.log('Deleting exam with ID:', raw);
                                             };

                                            deleteExam(exam.id);
                                            
                                        }}
                                    >
                                        {/* <Trash size={20} /> */}
                                    </button>
                                    </div>
                                 
                                    <Divider />
                                    <section>
                                        <p className="p1">
                                            <strong>Date:</strong>{' '}
                                            {new Date(exam.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <p className="p1">
                                            <strong>Room:</strong> {exam.room}
                                        </p>
                                        <p className="p1">
                                            <strong>Supervisor:</strong> {exam.supervisor}
                                        </p>
                                        <p className="p1">
                                            <strong>Time:</strong> {exam.startTime} - {exam.endTime}
                                        </p>
                                        <p className="p1">
                                            <strong>Attendance:</strong> {getAttendanceStatus(exam)}
                                        </p>
                                    </section>
                                    <button
                                        className="secondary-btn"
                                        onClick={() => navigate('/api/reports/report', { state: { exam } })}
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">No exams found.</div>
                        )}
                    </div>
                    {showSuccessAlert && (
                        <div className="success-alert">
                            Exam created successfully for {selectedStudents.length} students!
                        </div>
                    )}
                </>
            ) : (
                <div className="student-selection">
                    <h2>Select Students</h2>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="student-list">
                        {filteredStudents.map((student) => (
                            <div key={student.id} className="student-item">
                                <span>{student.attributes.find((attr) => attr.code === 'fname')?.value} {student.attributes.find((attr) => attr.code === 'lname')?.value}</span>
                                <button onClick={() => handleSelectStudent(student.id)}>
                                    {selectedStudents.includes(student.id) ? 'Deselect' : 'Select'}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="primary-btn" onClick={handleFinalSubmit}>
                        Submit Exam
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewExam;