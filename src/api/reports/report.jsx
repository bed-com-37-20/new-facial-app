
// import React, { useState } from 'react';
// import { useFetchOrganisationUnits } from '../../hooks/api-calls/apis';
// import './report.css';

// export default function Report() {
//     const { organisationUnits, loading, error } = useFetchOrganisationUnits();
//     const [selectedSchool, setSelectedSchool] = useState('');
//     const [orgUnitId, setOrgUnitId] = useState('');

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error loading data</div>;
//     if (!organisationUnits || organisationUnits.length === 0) {
//         return <div>No organization units found</div>;
//     }

//     const handleSchoolChange = (e) => {
//         const selectedSchool = organisationUnits.find(
//             (school) => school.displayName === e.target.value
//         );
//         setSelectedSchool(e.target.value);
//         setOrgUnitId(selectedSchool?.id || '');
//         console.log(orgUnitId);
//     };

//     return (
//         <div className="container">
//             <FilterCard
//                 organisationUnits={organisationUnits}
//                 handleSchoolChange={handleSchoolChange}
//             />
//             <Instructions />
//         </div>
//     );
// }

// const FilterCard = ({ organisationUnits, handleSchoolChange }) => (
//     <div className="filter-card">
//         <div className="filter-bar">
//             <label>
//                 School
//                 <select onChange={handleSchoolChange}>
//                     <option value="">Select a school</option>
//                     {organisationUnits.map((school) => (
//                         <option key={school.id} value={school.displayName}>
//                             {school.displayName}
//                         </option>
//                     ))}
//                 </select>
//             </label>
//             <label>
//                 Grade
//                 <select>
//                     <option>Select a year</option>
//                     {[1, 2, 3, 4, 5].map((grade) => (
//                         <option key={grade}>{grade}</option>
//                     ))}
//                 </select>
//             </label>
//             <label>
//                 Program
//                 <select>
//                     <option>Program of Study</option>
//                     {[
//                         'Computer Science',
//                         'Statistics',
//                         'Political Science',
//                         'Bachelor of Arts',
//                         'Information System',
//                     ].map((program) => (
//                         <option key={program}>{program}</option>
//                     ))}
//                 </select>
//             </label>
//             <div className="academic-year">
//                 <span>Academic Year</span>
//                 <span className="year">2025</span>
//             </div>
//         </div>
//     </div>
// );

// const Instructions = () => (
//     <div className="instructions-container">
//         <div className="instructions-box">
//             <h3>SEMIS-Report</h3>
//             <p>Follow the instructions to proceed:</p>
//             <ul>
//                 <li>Select the Organization unit you want to view the Report for</li>
//                 <li>Use global filters (Class, Grade, and Academic Year)</li>
//             </ul>
//         </div>
//     </div>
// );


////////////////////////////////
// import React from 'react';
// import { useState } from 'react';
// import { useFetchOrganisationUnits } from '../../hooks/api-calls/apis';
// import './report.css';
// import { useLocation } from 'react-router-dom';

// const Report = () => {
//     const location = useLocation();
//     const { exam } = location.state || {};

//     if (!exam) {
//         return <p>No exam data available.</p>;
//     }
//     const allStudents = {
//         Name: "Plaston Zanda",
//         RegNumber: "667"
//     }

//     return (
//         <div className="report-container">
//             <h1>Exam Report</h1>
//             <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
//                 <thead>
//                     <tr>
//                         <th>Course</th>
//                         <th>Date</th>
//                         <th>Supervisor</th>
//                         <th>Time</th>
//                         <th>Room</th>
//                         <th>Number of Students</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>{exam.courseName}</td>
//                         <td>{exam.date}</td>
//                         <td>{exam.supervisorName}</td>
//                         <td>{exam.startTime} - {exam.endTime}</td>
//                         <td>{exam.room}</td>
//                         <td> 7
//                             <button className = "ViewAll" onClick={""}>View All</button>
//                         </td></tr>
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Report;
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './report.css';

const Report = () => {
    const location = useLocation();
    const { exam } = location.state || {};

    const [showStudents, setShowStudents] = useState(false);

    const allStudents = [
        { Name: "Plaston Zanda", RegNumber: "667" },
        { Name: "John Banda", RegNumber: "123" },
        { Name: "Jane Phiri", RegNumber: "456" },
    ];

    if (!exam) {
        return <p>No exam data available.</p>;
    }

    const handleViewAllClick = () => {
        setShowStudents(!showStudents);
    };

    return (
        <div className="report-container">
            <h1>Exam Report</h1>

            {/* Modal for displaying students */}
            {showStudents && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>All Students</h2>
                        <ul>
                            {allStudents.map((student, index) => (
                                <li key={index}>
                                    {student.Name} - {student.RegNumber}
                                </li>
                            ))}
                        </ul>
                        <button className="close-modal" onClick={handleViewAllClick}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Date</th>
                        <th>Supervisor</th>
                        <th>Time</th>
                        <th>Room</th>
                        <th>Number of Students</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{exam.courseName}</td>
                        <td>{exam.date}</td>
                        <td>{exam.supervisorName}</td>
                        <td>{exam.startTime} - {exam.endTime}</td>
                        <td>{exam.room}</td>
                        <td>
                            7
                            <button className="ViewAll" onClick={handleViewAllClick}>
                                {showStudents ? "Hide All" : "View All"}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Report;