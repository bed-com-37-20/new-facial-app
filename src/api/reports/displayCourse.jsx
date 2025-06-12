import React, { useState } from 'react';

const CourseDisplay = ({ courses }) => {
  const [expandedCourse, setExpandedCourse] = useState(null);

  const toggleExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'present':
        return { background: '#d5f5e3', text: '#27ae60' };
      case 'absent':
        return { background: '#fadbd8', text: '#e74c3c' };
      case 'late':
        return { background: '#fdebd0', text: '#f39c12' };
      default:
        return { background: '#ebedef', text: '#7f8c8d' };
    }
  };

    return (
        <>
            <header style={{
                backgroundColor: '#2c3e50',
                color: 'white',
                padding: '20px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: "5px",
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(8, 8, 8, 0.1)'
            }}>
                Examinational Reports
            </header>
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {courses.map(course => (
                    <div key={course.id} style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        marginBottom: '20px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid #eaeaea',
                            backgroundColor: '#f8f9fa'
                        }}>
                            <h3 style={{
                                color: '#2c3e50',
                                fontSize: '20px',
                                margin: '0 0 10px 0'
                            }}>{course.examName}</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '10px',
                                fontSize: '15px'
                            }}>
                                <span style={{ color: '#7f8c8d' }}><strong style={{ color: '#2c3e50' }}>Room:</strong> {course.room || 'N/A'}</span>
                                <span style={{ color: '#7f8c8d' }}><strong style={{ color: '#2c3e50' }}>Date:</strong> {formatDate(course.date)}</span>
                                <span style={{ color: '#7f8c8d' }}><strong style={{ color: '#2c3e50' }}>Time:</strong> {course.startTime} - {course.endTime}</span>
                                <span style={{ color: '#7f8c8d' }}><strong style={{ color: '#2c3e50' }}>Supervisor:</strong> {course.supervisor || 'N/A'}</span>
                            </div>
                        </div>

                        {course.students?.length > 0 ? (
                            <div style={{ padding: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: expandedCourse === course.id ? '15px' : '0'
                                }}>
                                    <h4 style={{
                                        color: '#2c3e50',
                                        fontSize: '18px',
                                        margin: '0'
                                    }}>Enrolled Students ({course.students.length})</h4>
                                    <button 
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: '#3498db',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            ':hover': {
                                                backgroundColor: '#2980b9'
                                            }
                                        }}
                                        onClick={() => toggleExpand(course.id)}
                                    >
                                        {expandedCourse === course.id ? 'Hide Students' : 'Show Students'}
                                    </button>
                                </div>
                                {expandedCourse === course.id && (
                                    <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                                        <table style={{
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            fontSize: '16px'
                                        }}>
                                            <thead>
                                                <tr style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderBottom: '2px solid #eaeaea'
                                                }}>
                                                    <th style={{
                                                        padding: '15px',
                                                        textAlign: 'left',
                                                        fontWeight: '600',
                                                        color: '#2c3e50'
                                                    }}>Name</th>
                                                    <th style={{
                                                        padding: '15px',
                                                        textAlign: 'left',
                                                        fontWeight: '600',
                                                        color: '#2c3e50'
                                                    }}>Registration</th>
                                                    <th style={{
                                                        padding: '15px',
                                                        textAlign: 'left',
                                                        fontWeight: '600',
                                                        color: '#2c3e50'
                                                    }}>Status</th>
                                                
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {course.students.map(student => (
                                                    <tr key={student.id} style={{
                                                        borderBottom: '1px solid #eaeaea',
                                                        ':hover': {
                                                            backgroundColor: '#f8f9fa'
                                                        }
                                                    }}>
                                                        <td style={{
                                                            padding: '15px',
                                                            color: '#2c3e50'
                                                        }}>{student.name}</td>
                                                        <td style={{
                                                            padding: '15px',
                                                            color: '#2c3e50'
                                                        }}>{student.registrationNumber}</td>
                                                        <td style={{ padding: '15px' }}>
                                                            <span style={{
                                                                display: 'inline-block',
                                                                padding: '5px 10px',
                                                                borderRadius: '20px',
                                                                fontSize: '14px',
                                                                fontWeight: '500',
                                                                backgroundColor: getStatusColor(student.status).background,
                                                                color: getStatusColor(student.status).text
                                                            }}>
                                                                {student.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p style={{
                                padding: '20px',
                                color: '#7f8c8d',
                                textAlign: 'center',
                                margin: '0'
                            }}>No students enrolled</p>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};


export default CourseDisplay;