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
        const fetchCourses = async () => {
            try {
                const response = await fetch('https://facial-attendance-system-6vy8.onrender.com/attendance/getAllCourses');
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                // Handle both single exam and array of exams
                console.log('Fetched exams:', data);
                setExams(Array.isArray(data) ? data : [data]);
            } catch (error) {
                setExams([]);
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
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

    const handleSelectAll = (studentIds, select) => {
        setSelectedStudents((prev) =>
            select ? [...new Set([...prev, ...studentIds])] : prev.filter((id) => !studentIds.includes(id))
        );
    };

    const handleOrgUnitChange = (e) => {
        setSelectedOrgUnit(e.target.value);
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
                            <button className="primary-btn" onClick={handleCreateExam}>
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
                                    <h3>{exam.examName}</h3>
                                    <button
                                       style={{color:'red', background: 'none', border: 'none', cursor: 'pointer',margin: '0 10px' }}
                                        onClick={() => {
                                            // Add delete functionality here
                                            const deleteExam = async (examId) => {
                                                console.log('Deleting exam with ID:', examId);
                                                try {
                                                    const response = await fetch(`https://facial-attendance-system-6vy8.onrender.com/attendance/deleteCourseById`, {

                                                        method: 'DELETE',
                                                        body: JSON.stringify({ "ids": [examId] }),
                                                    });
                                                    if (!response.ok) {
                                                        throw new Error('Failed to delete exam');
                                                    }
                                                    alert('Exam deleted successfully!');
                                                    setExams((prevExams) => prevExams.filter((exam) => exam.id !== examId));
                                                } catch (error) {
                                                    console.error('Error deleting exam:', error);
                                                    alert('Failed to delete exam. Please try again.');
                                                }
                                            };

                                            deleteExam(exam.id);
                                            
                                        }}
                                    >
                                        <Trash size={20} />
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
                                        {/* {exam.students?.length > 0 && (
                                            <div className="student-preview">
                                                <strong>Students:</strong>
                                                <ul>
                                                    {exam.students.slice(0, 3).map(student => (
                                                        <li key={student.id}>
                                                            {student.name} ({student.registrationNumber}) - {student.status}
                                                        </li>
                                                    ))}
                                                    {exam.students.length > 3 && (
                                                        <li>+{exam.students.length - 3} more...</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )} */}
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