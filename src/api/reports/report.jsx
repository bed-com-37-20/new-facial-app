import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';
//import { FaUsers, FaClock, FaCalendarAlt, FaBook, FaHome, FaUser, FaTimes } from 'react-icons/fa';

const Report = () => {
    const location = useLocation();
    const { exam } = location.state || {};
    const [showStudents, setShowStudents] = useState(false);

    const allStudents = [
        { Name: "Plaston Zanda", RegNumber: "bed-com-10-20" },
        { Name: "John Banda", RegNumber: "bed-com-11-20" },
        { Name: "Jane Phiri", RegNumber: "bed-com-13-20" },
        { Name: "Michael Sata", RegNumber: "bed-com-14-20" },
        { Name: "Edgar Lungu", RegNumber: "bed-com-15-20" },
    ];

    if (!exam) {
        return (
            <div className="no-data-container">
                <div className="no-data-card">
                    <h2>No Exam Data Available</h2>
                    <p>Please select an exam from the exam list to view its report.</p>
                </div>
            </div>
        );
    }

    const handleViewAllClick = () => {
        setShowStudents(!showStudents);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div style={styles.container}>
            <FilterCard
                organisationUnits={organisationUnits}
                handleSchoolChange={handleSchoolChange}
            />
            <Instructions />
        </div>
    );
};

// FilterCard Component
const FilterCard = ({ organisationUnits, handleSchoolChange }) => (
    <div className="filter-card">
        <div className="filter-bar">
            <label>
                School
                <select onChange={handleSchoolChange}>
                    <option value="">Select a school</option>
                    {organisationUnits.map((school) => (
                        <option key={school.id} value={school.displayName}>
                            {school.displayName}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Grade
                <select>
                    <option>Select a year</option>
                    {[1, 2, 3, 4, 5].map((grade) => (
                        <option key={grade}>{grade}</option>
                    ))}
                </select>
            </label>
            <label>
                Program
                <select>
                    <option>Program of Study</option>
                    {[
                        'Computer Science',
                        'Statistics',
                        'Political Science',
                        'Bachelor of Arts',
                        'Information System',
                    ].map((program) => (
                        <option key={program}>{program}</option>
                    ))}
                </select>
            </label>
            <div className="academic-year">
                <span>Academic Year</span>
                <span className="year">2025</span>
            </div>
        </div>
    </div>
);

// Instructions Component
const Instructions = () => (
    <div className="instructions-container" style={styles.instructionsContainer}>
      <div className="instructions-box" style={styles.instructionsBox}>
            <h3>SEMIS-Report</h3>
            <p>Follow the instructions to proceed:</p>
            <ul>
                <li>Select the Organization unit you want to view the Report for</li>
                <li>Use global filters (Class, Grade, and Academic Year)</li>
            </ul>
        </div>
    </div>
);

// Styles
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },

    instructionsContainer: {
        width: '100%', 
        display: 'flex',
        justifyContent: 'center', 
        marginTop: '20px',
    },
    instructionsBox: {
        width: '600px', 
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
    },
};
