import React, { useState } from 'react';
import { useFetchOrganisationUnits } from '../../hooks/api-calls/apis';

export default function Report(){
    const { organisationUnits, loading, error } = useFetchOrganisationUnits();
    const [selectedSchool, setSelectedSchool] = useState('');
    const [orgUnitId, setOrgUnitId] = useState('');

    // Handle loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;
    if (!organisationUnits || organisationUnits.length === 0) {
        return <div>No organization units found</div>;
    }

    // Handle school selection
    const handleSchoolChange = (e) => {
        const selectedSchool = organisationUnits.find(
            (school) => school.displayName === e.target.value
        );
        setSelectedSchool(e.target.value);
        setOrgUnitId(selectedSchool?.id || '');
        console.log(orgUnitId);
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
