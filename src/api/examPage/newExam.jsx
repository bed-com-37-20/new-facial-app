import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './exam.css';
import { Divider } from '@material-ui/core';

const NewExam = () => {
    const [filter, setFilter] = useState('');
    const [exams, setExams] = useState([
        { 
            id: 1, 
            courseName: 'SCE 421', 
            date: '2023-10-01', 
            room: '101', 
            supervisorName: 'Joshua Judge', 
            startTime: '09:00', 
            endTime: '11:00' 
        },
        { 
            id: 2, 
            courseName: 'COM 211', 
            date: '2023-09-15', 
            room: '202', 
            supervisorName: 'Isaac Mwakabila', 
            startTime: '10:00', 
            endTime: '12:00' 
        },
        { 
            id: 3, 
            courseName: 'MAT 211', 
            date: '2023-08-20', 
            room: '303', 
            supervisorName: 'Alice Namagale', 
            startTime: '13:00', 
            endTime: '15:00' 
        },
    ]);
    const [showPopup, setShowPopup] = useState(false);
    const [newExam, setNewExam] = useState({ 
        courseName: '', 
        date: '', 
        room: '', 
        supervisorName: '', 
        startTime: '', 
        endTime: '' 
    });
    const navigate = useNavigate();

    const filteredExams = exams.filter(
        (exam) =>
            exam.courseName.toLowerCase().includes(filter.toLowerCase()) ||
            exam.date.includes(filter)
    );

    const handleCreateExam = () => {
        // console.log(newExam)
        setShowPopup(false);
        navigate('/api/examPage/select-students', {
            state: newExam 
        });
    };

    return (
        <div className="exam-container">
            <div className="header">
                <h1 style={{ color: '#101345' }}>Exam Summary</h1>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by course name or date..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ color: '#101345', backgroundColor: 'white', border: '1px solid #101345' }}
                    />
                    <button 
                        style={{
                            backgroundColor: 'darkblue',
                            color: 'white',
                        }}
                        className="primary-btn"
                        onClick={() => setShowPopup(true)}
                        // style={{ color: '#101345', backgroundColor: 'white', border: '1px solid #101345' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                        New
                    </button>
                </div>
            </div>
            <Divider />
            <p style={{marginTop:'2rem'}}>Below is a summary of past exams. You can view details or create a new exam using the options provided.</p>
            <div className="card-container">
              
                {filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
                        <div key={exam.id} className="exam-card">
                            <h3 style={{alignItems:'center'}}>{exam.courseName}</h3>
                            <Divider/>
                            <p>
                                <strong>Date:</strong>{' '}
                                {new Date(exam.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <p>
                                <strong>Room:</strong> {exam.room}
                            </p>
                            <p>
                                <strong>Supervisor:</strong> {exam.supervisorName}
                            </p>
                            <p>
                                <strong>Time:</strong> {exam.startTime} - {exam.endTime}
                            </p>
                            <button
                                style={{
                                    color: 'white'
                                }}
                                className="secondary-btn"
                                onClick={() => navigate('/api/reports/report', {
                                    state: { exam }
                                })}
                            >
                                View
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No exams found matching your search criteria.</p>
                    </div>
                )}
            </div>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create New Exam</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCreateExam();
                            }}
                        >
                            <div className="form-group">
                                <label>Exam Name</label>
                                <input
                                    type="text"
                                    value={newExam.examName}
                                    onChange={(e) =>
                                        setNewExam({ ...newExam, examName: e.target.value })
                                    }
                                    required
                                    placeholder="Enter exam name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Course Name</label>
                                <input
                                    type="text"
                                    value={newExam.courseName}
                                    onChange={(e) =>
                                        setNewExam({ ...newExam, courseName: e.target.value })
                                    }
                                    required
                                    placeholder="Enter course name"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={newExam.date}
                                        onChange={(e) =>
                                            setNewExam({ ...newExam, date: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Room</label>
                                    <input
                                        type="text"
                                        value={newExam.room}
                                        onChange={(e) =>
                                            setNewExam({ ...newExam, room: e.target.value })
                                        }
                                        required
                                        placeholder="Room number"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Supervisor Name</label>
                                <input
                                    type="text"
                                    value={newExam.supervisorName}
                                    onChange={(e) =>
                                        setNewExam({ ...newExam, supervisorName: e.target.value })
                                    }
                                    required
                                    placeholder="Enter supervisor's name"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        value={newExam.startTime}
                                        onChange={(e) =>
                                            setNewExam({ ...newExam, startTime: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        value={newExam.endTime}
                                        onChange={(e) =>
                                            setNewExam({ ...newExam, endTime: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    Create Exam
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewExam;