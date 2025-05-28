// import React, { useState, useEffect } from 'react';
// import EnrollmentForm from './EnrollmentForm';
// import {
//   UserPlus,
//   Download,
//   Pencil,
//   Trash2,
//   Search
// } from 'lucide-react';
// import './Enrollment.css';
// import { useFetchOrganisationUnits, useEnrolledStudents } from '../hooks/api-calls/apis';

// interface Enrollment {
//   regNumber: string;
//   firstName: string;
//   surname: string;
//   school: string;
//   programOfStudy: string;
//   yearOfStudy: string;
//   nationality: string;
//   gender: string;
//   profilePicture?: string;
// }

// const EnrollmentPage: React.FC = () => {
//   const [selectedSchool, setSelectedSchool] = useState('');
//   const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
//   const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
//   const [editingEnrollment, setEditingEnrollment] = useState<{ enrollment: Enrollment; index: number } | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [orgUnitId, setOrgUnitId] = useState('');

//   const { loading, error, organisationUnits } = useFetchOrganisationUnits();
  

//   // Load students from API when orgUnitId changes

//   const handleEnrollStudentClick = () => {
//     setEditingEnrollment(null);
//     setShowEnrollmentForm(true);
//   };



//   const handleCloseForm = () => setShowEnrollmentForm(false);

//   const handleFormSubmit = (formData: Enrollment) => {
//     if (editingEnrollment) {
//       const updated = enrollments.map((e, i) => (i === editingEnrollment?.index ? formData : e));
//       setEnrollments(updated);
//       setEditingEnrollment(null);
//     } else {
//       setEnrollments([...enrollments, formData]);
//     }
//     setShowEnrollmentForm(false);
//   };

//   const handleEditClick = (enrollment, index) => {
//     setEditingEnrollment({ enrollment, index });
//     setShowEnrollmentForm(true);
//   };

//   const filteredEnrollments = enrollments.filter((e) =>
//     `${e.firstName} ${e.surname} ${e.programOfStudy} ${e.yearOfStudy}`
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error loading data</div>;
//   if (!organisationUnits || organisationUnits.length === 0) return <div>No organization units found</div>;
 
//   useEffect(() => {
//     console.log(orgUnitId)
   
//   }, [orgUnitId]);
//   return (
//     <div id="enrollment-container" className="enrollment-container">
//       {showEnrollmentForm && (
//         <div className="modal-backdrop">
//           <div className="modal-content">
//             <button className="modal-close" onClick={handleCloseForm}>
//               &times;
//             </button>
//             <EnrollmentForm
//               school={selectedSchool}
//               onSubmit={handleFormSubmit}
//               editingEnrollment={editingEnrollment}
//               orgUnitId={orgUnitId}
//             />
//           </div>
//         </div>
//       )}

//       {!showEnrollmentForm && (
//         <div className="filter-card">
//           <div className="filter-bar">
//             <label>
//               School
//               <select
//                 onChange={(e) => {
//                   const selected = organisationUnits.find(
//                     (school) => school.displayName === e.target.value
//                   );
//                   setSelectedSchool(e.target.value);
//                   setOrgUnitId(selected?.id || '');
              
//                 }}
//               >
//                 <label >Select a school</label>
//                 {organisationUnits.map((school) => (
//                   <option key={school.id} value={school.displayName}>
//                     {school.displayName}
//                   </option>
                 
//                 ))}
//               </select>
//             </label>
//             <label>
//               Grade
//               <select>
//                 <option>Select a year</option>
//                 {[1, 2, 3, 4, 5].map((grade) => (
//                   <option key={grade}>{grade}</option>
//                 ))}
//               </select>
//             </label>
//             <label>
//               Program
//               <select>
//                 <option>Program of Study</option>
//                 {[
//                   "Computer Science",
//                   "Statistics",
//                   "Political Science",
//                   "Bachelor of Arts",
//                   "Information System"
//                 ].map((program) => (
//                   <option key={program}>{program}</option>
//                 ))}
//               </select>
//             </label>
//             <div className="academic-year">
//               <span>Academic Year</span>
//               <span className="year">2025</span>
//             </div>
//           </div>
//         </div>
//       )}

//       {selectedSchool && !showEnrollmentForm ? (
//         <div className="enrollments-section">
//           <h2>Enrollments</h2>
//           <div className="action-bar">
//             <div className="search-wrapper">
//               <Search className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search Student"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <button onClick={handleEnrollStudentClick}>
//               <UserPlus size={16} />
//               Enroll Student
//             </button>
//             <button>
//               <Download size={16} />
//               Download PDF
//             </button>
//           </div>

//           {filteredEnrollments.length > 0 ? (
//             <table className="enrollment-table">
//               <thead>
//                 <tr>
//                   {[
//                     "Reg Number",
//                     "First Name",
//                     "Surname",
//                     "School",
//                     "Program Of Study",
//                     "Year of Study",
//                     "Nationality",
//                     "Gender",
//                     "Profile Picture",
//                     "Actions"
//                   ].map((header) => (
//                     <th key={header}>{header}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredEnrollments.map((enrollment, index) => (
//                   <tr key={index}>
//                     <td>{enrollment.regNumber}</td>
//                     <td>{enrollment.firstName}</td>
//                     <td>{enrollment.surname}</td>
//                     <td>{enrollment.school}</td>
//                     <td>{enrollment.programOfStudy}</td>
//                     <td>{enrollment.yearOfStudy}</td>
//                     <td>{enrollment.nationality}</td>
//                     <td>{enrollment.gender}</td>
//                     <td>
//                       <img
//                         src={enrollment.profilePicture || 'https://via.placeholder.com/50'}
//                         alt="Profile"
//                         className="profile-img"
//                       />
//                     </td>
//                     <td className="action-buttons">
//                       <button onClick={() => handleEditClick(enrollment, index)}>
//                         <Pencil size={16} color="#4caf50" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (window.confirm('Are you sure you want to delete this enrollment?')) {
//                             const updated = enrollments.filter((_, i) => i !== index);
//                             setEnrollments(updated);
//                           }
//                         }}
//                       >
//                         <Trash2 size={16} color="#f44336" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             searchQuery && (
//               <div className="no-results">No Student or any Information match your search.</div>
//             )
//           )}
//         </div>
//       ) : (
//         <div className="instructions-container">
//           <div className="instructions-box">
//             <h3>SEMIS-Enrollment</h3>
//             <p>Follow the instructions to proceed:</p>
//             <ul>
//               <li>Select the Organization unit you want to view data</li>
//               <li>Use global filters (Class, Grade, and Academic Year)</li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnrollmentPage;
<metadata>
    <trackedEntityInstances>
        <trackedEntityInstance created="2025-05-25T13:11:52.349" orgUnit="jV19pSjiueH" createdAtClient="2025-05-25T13:11:52.349" trackedEntityInstance="UfijqRhZGll" lastUpdated="2025-05-25T13:11:52.350" trackedEntityType="N6eVEDUrpYU" lastUpdatedAtClient="2025-05-25T13:11:52.349">
            <inactive>false</inactive>
            <deleted>false</deleted>
            <featureType>NONE</featureType>
            <attributes>
                <attribute lastUpdated="2025-05-25T13:11:52.514" storedBy="admin" code="enroll_date" displayName="Enrollment Date" created="2025-05-25T13:11:52.514" valueType="DATE" attribute="ixauprApakv" value="2025-05-25" />
                <attribute lastUpdated="2025-05-25T13:11:52.491" storedBy="admin" code="school name" displayName="School Name" created="2025-05-25T13:11:52.453" valueType="ORGANISATION_UNIT" attribute="ct4z0T1F36i" value="University Of Malawi" />
                <attribute lastUpdated="2025-05-25T13:11:52.550" storedBy="admin" code="nationality" displayName="Nationality" created="2025-05-25T13:11:52.550" valueType="TEXT" attribute="hhyS9WANpuz" value="MW" />
                <attribute lastUpdated="2025-05-25T13:11:52.504" storedBy="admin" code="year of study" displayName="Year of study" created="2025-05-25T13:11:52.504" valueType="NUMBER" attribute="EHTfWCHTYCo" value="4" />
                <attribute lastUpdated="2025-05-25T13:11:52.523" storedBy="admin" code="fname" displayName="First name" created="2025-05-25T13:11:52.523" valueType="TEXT" attribute="nlAAn9uTTie" value="Moses" />
                <attribute lastUpdated="2025-05-25T13:11:52.563" storedBy="admin" code="regnumber" displayName="Registration Number" created="2025-05-25T13:11:52.563" valueType="TEXT" attribute="ofiRHvsg4Mt" value="bsc-com-03-22" />
                <attribute lastUpdated="2025-05-25T13:11:52.531" storedBy="admin" code="lname" displayName="Last Name" created="2025-05-25T13:11:52.531" valueType="TEXT" attribute="KHFDJkJgUvj" value="Chingwe" />
                <attribute lastUpdated="2025-05-25T13:11:52.509" storedBy="admin" code="program of study" displayName="Program of study" created="2025-05-25T13:11:52.509" valueType="TEXT" attribute="ADiCfoRxZI2" value="ComputerScience" />
                <attribute lastUpdated="2025-05-25T13:11:52.543" storedBy="admin" code="dateOfBirth" displayName="Date of Birth" created="2025-05-25T13:11:52.542" valueType="DATE" attribute="EAPD9u4neIp" value="1999-12-31" />
                <attribute lastUpdated="2025-05-25T13:11:52.536" storedBy="admin" code="gender" displayName="Gender" created="2025-05-25T13:11:52.536" valueType="TEXT" attribute="Cg56JK84NAd" value="male" />
                <attribute lastUpdated="2025-05-25T13:11:52.557" storedBy="admin" code="guardian" displayName="Guardian Name" created="2025-05-25T13:11:52.557" valueType="TEXT" attribute="pzZJIX2yMEZ" value="Chingwe" />
                <attribute lastUpdated="2025-05-25T13:11:52.499" storedBy="admin" code="academic year" displayName="Academic year" created="2025-05-25T13:11:52.499" valueType="TEXT" attribute="aqBmqM1onC7" value="2025-2026" />
            </attributes>
        </trackedEntityInstance>
        <trackedEntityInstance created="2025-05-23T22:42:57.018" orgUnit="jV19pSjiueH" createdAtClient="2025-05-23T22:42:57.018" trackedEntityInstance="GrQzWTLfYlX" lastUpdated="2025-05-23T22:42:57.018" trackedEntityType="N6eVEDUrpYU" lastUpdatedAtClient="2025-05-23T22:42:57.018">
            <inactive>false</inactive>
            <deleted>false</deleted>
            <featureType>NONE</featureType>
            <attributes>
                <attribute lastUpdated="2025-05-23T22:42:57.047" storedBy="admin" code="year of study" displayName="Year of study" created="2025-05-23T22:42:57.047" valueType="NUMBER" attribute="EHTfWCHTYCo" value="4" />
                <attribute lastUpdated="2025-05-23T22:42:57.059" storedBy="admin" code="lname" displayName="Last Name" created="2025-05-23T22:42:57.059" valueType="TEXT" attribute="KHFDJkJgUvj" value="Zanda" />
                <attribute lastUpdated="2025-05-23T22:42:57.050" storedBy="admin" code="program of study" displayName="Program of study" created="2025-05-23T22:42:57.050" valueType="TEXT" attribute="ADiCfoRxZI2" value="ComputerScience" />
                <attribute lastUpdated="2025-05-23T22:42:57.062" storedBy="admin" code="dateOfBirth" displayName="Date of Birth" created="2025-05-23T22:42:57.062" valueType="DATE" attribute="EAPD9u4neIp" value="1990-12-31" />
                <attribute lastUpdated="2025-05-23T22:42:57.057" storedBy="admin" code="fname" displayName="First name" created="2025-05-23T22:42:57.057" valueType="TEXT" attribute="nlAAn9uTTie" value="Plastol" />
                <attribute lastUpdated="2025-05-23T22:42:57.064" storedBy="admin" code="nationality" displayName="Nationality" created="2025-05-23T22:42:57.064" valueType="TEXT" attribute="hhyS9WANpuz" value="Malawian" />
                <attribute lastUpdated="2025-05-23T22:42:57.067" storedBy="admin" code="regnumber" displayName="Registration Number" created="2025-05-23T22:42:57.067" valueType="TEXT" attribute="ofiRHvsg4Mt" value="bed-com-37-20" />
                <attribute lastUpdated="2025-05-23T22:42:57.066" storedBy="admin" code="guardian" displayName="Guardian Name" created="2025-05-23T22:42:57.066" valueType="TEXT" attribute="pzZJIX2yMEZ" value="Plastol" />
                <attribute lastUpdated="2025-05-23T22:42:57.061" storedBy="admin" code="gender" displayName="Gender" created="2025-05-23T22:42:57.061" valueType="TEXT" attribute="Cg56JK84NAd" value="male" />
                <attribute lastUpdated="2025-05-23T22:42:57.042" storedBy="admin" code="school name" displayName="School Name" created="2025-05-23T22:42:57.042" valueType="ORGANISATION_UNIT" attribute="ct4z0T1F36i" value="University Of Malawi" />
                <attribute lastUpdated="2025-05-23T22:42:57.046" storedBy="admin" code="academic year" displayName="Academic year" created="2025-05-23T22:42:57.046" valueType="TEXT" attribute="aqBmqM1onC7" value="2025-2026" />
                <attribute lastUpdated="2025-05-23T22:42:57.054" storedBy="admin" code="enroll_date" displayName="Enrollment Date" created="2025-05-23T22:42:57.054" valueType="DATE" attribute="ixauprApakv" value="2025-05-24" />
            </attributes>
        </trackedEntityInstance>
        <trackedEntityInstance created="2025-05-23T22:17:26.786" orgUnit="jV19pSjiueH" createdAtClient="2025-05-23T22:17:26.786" trackedEntityInstance="sBP7Ctbt0lr" lastUpdated="2025-05-23T22:17:26.787" trackedEntityType="N6eVEDUrpYU" lastUpdatedAtClient="2025-05-23T22:17:26.786">
            <inactive>false</inactive>
            <deleted>false</deleted>
            <featureType>NONE</featureType>
            <attributes>
                <attribute lastUpdated="2025-05-23T22:17:26.803" storedBy="admin" code="school name" displayName="School Name" created="2025-05-23T22:17:26.803" valueType="ORGANISATION_UNIT" attribute="ct4z0T1F36i" value="University Of Malawi" />
                <attribute lastUpdated="2025-05-23T22:17:26.844" storedBy="admin" code="gender" displayName="Gender" created="2025-05-23T22:17:26.844" valueType="TEXT" attribute="Cg56JK84NAd" value="male" />
                <attribute lastUpdated="2025-05-23T22:17:26.819" storedBy="admin" code="enroll_date" displayName="Enrollment Date" created="2025-05-23T22:17:26.818" valueType="DATE" attribute="ixauprApakv" value="2025-05-24" />
                <attribute lastUpdated="2025-05-23T22:17:26.809" storedBy="admin" code="year of study" displayName="Year of study" created="2025-05-23T22:17:26.809" valueType="NUMBER" attribute="EHTfWCHTYCo" value="4" />
                <attribute lastUpdated="2025-05-23T22:17:26.823" storedBy="admin" code="fname" displayName="First name" created="2025-05-23T22:17:26.823" valueType="TEXT" attribute="nlAAn9uTTie" value="Plastol" />
                <attribute lastUpdated="2025-05-23T22:17:26.839" storedBy="admin" code="lname" displayName="Last Name" created="2025-05-23T22:17:26.838" valueType="TEXT" attribute="KHFDJkJgUvj" value="Zanda" />
                <attribute lastUpdated="2025-05-23T22:17:26.815" storedBy="admin" code="program of study" displayName="Program of study" created="2025-05-23T22:17:26.812" valueType="TEXT" attribute="ADiCfoRxZI2" value="ComputerScience" />
                <attribute lastUpdated="2025-05-23T22:17:26.851" storedBy="admin" code="dateOfBirth" displayName="Date of Birth" created="2025-05-23T22:17:26.850" valueType="DATE" attribute="EAPD9u4neIp" value="1990-12-31" />
                <attribute lastUpdated="2025-05-23T22:17:26.854" storedBy="admin" code="nationality" displayName="Nationality" created="2025-05-23T22:17:26.854" valueType="TEXT" attribute="hhyS9WANpuz" value="Malawian" />
                <attribute lastUpdated="2025-05-23T22:17:26.861" storedBy="admin" code="regnumber" displayName="Registration Number" created="2025-05-23T22:17:26.861" valueType="TEXT" attribute="ofiRHvsg4Mt" value="bed-com-23-20" />
                <attribute lastUpdated="2025-05-23T22:17:26.808" storedBy="admin" code="academic year" displayName="Academic year" created="2025-05-23T22:17:26.807" valueType="TEXT" attribute="aqBmqM1onC7" value="2025-2026" />
                <attribute lastUpdated="2025-05-23T22:17:26.858" storedBy="admin" code="guardian" displayName="Guardian Name" created="2025-05-23T22:17:26.857" valueType="TEXT" attribute="pzZJIX2yMEZ" value="Plastol" />
            </attributes>
        </trackedEntityInstance>
    </trackedEntityInstances>
</metadata>