import React from 'react';
import './displayCourse.css';

const CourseDisplay = ({ courses }) => {
    // Format date or return placeholder
    const formatDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get CSS class for status
    const getStatusClass = (status) => {
        return `status-${status.toLowerCase()}`;
    };

    return (
        <div className="course-display">
            <h2>Exam Courses</h2>

            {courses.length === 0 ? (
                <p className="no-courses">No courses found</p>
            ) : (
                <div className="courses-container">
                    {courses.map(course => {
                        const [isExpanded, setIsExpanded] = React.useState(false);

                        return (
                            <div key={course.id} className="course-card">
                                <div className="course-header">
                                    <h3>{course.examName}</h3>
                                    <div className="course-meta">
                                        <span><strong>Room:</strong> {course.room || 'N/A'}</span>
                                        <span><strong>Date:</strong> {formatDate(course.date)}</span>
                                        <span><strong>Time:</strong> {course.startTime} - {course.endTime}</span>
                                        <span><strong>Supervisor:</strong> {course.supervisor || 'N/A'}</span>
                                    </div>
                                </div>

                                {course.students?.length > 0 ? (
                                    <div className="students-section">
                                        <h4>Enrolled Students ({course.students.length})</h4>
                                        <button 
                                            className="toggle-button" 
                                            onClick={() => setIsExpanded(!isExpanded)}
                                        >
                                            {isExpanded ? 'Minimize' : 'Expand'}
                                        </button>
                                        {isExpanded && (
                                            <table className="students-table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Registration</th>
                                                        <th>Status</th>
                                                        <th>Last Marked</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {course.students.map(student => (
                                                        <tr key={student.id}>
                                                            <td>{student.name}</td>
                                                            <td>{student.registrationNumber}</td>
                                                            <td>
                                                                <span className={`status-badge ${getStatusClass(student.status)}`}>
                                                                    {student.status}
                                                                </span>
                                                            </td>
                                                            <td>{student.lastMarkedAt ? new Date(student.lastMarkedAt).toLocaleString() : 'Never'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ) : (
                                    <p className="no-students">No students enrolled</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CourseDisplay;