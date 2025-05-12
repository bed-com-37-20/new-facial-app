import React from 'react';
import { useFetchOrganisationUnits } from '../../hooks/api-calls/apis';
//import { useFetchOrganisationUnits } from '../../../hooks/useFetchOrganisationUnits';
import { useState } from 'react';


const Report = () => {
    const { organisationUnits } = useFetchOrganisationUnits();
    const [selectedSchool, setSelectedSchool] = useState('');
    const [orgUnitId, setOrgUnitId] = useState('');

      const { loading, error } = useFetchOrganisationUnits();
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error loading data</div>;
      if (!organisationUnits || organisationUnits.length === 0) { 
        return <div>No organization units found</div>;
      }else{
        console.log(organisationUnits);
      }

    return (
        <div style={styles.container}>
            <div className="filter-card">
                <div className="filter-bar">
                <label>
                    School
                    <select
                      onChange={(e) => {
                      const selectedSchool = organisationUnits.find(
                        (school) => school.displayName === e.target.value
                      );
                      setSelectedSchool(e.target.value);
                      setOrgUnitId(selectedSchool?.id || '');
                      console.log(orgUnitId);
                      }}
                    >
                      <option value={organisationUnits[1]}>Select a school</option>
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
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#333',
    },
};

export default Report;