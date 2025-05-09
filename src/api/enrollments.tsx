import React, { useEffect, useState } from 'react';
import EnrollmentForm from './EnrollmentForm';
import { faUserPlus, faDownload, faPen, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {fetchOrganisationUnits} from '../hooks/api-calls/integration'

interface Enrollment {
    regNumber: string;
    firstName: string;
    surname: string;
    school: string;
    programOfStudy: string;
    yearOfStudy: string;
    nationality: string;
    gender: string;
    profilePicture?: string;
}

const EnrollmentPage: React.FC = () => {

     const [selectedSchool, setSelectedSchool] = useState('');
      const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

    
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]); // Store submitted enrollment data
      const [editingEnrollment, setEditingEnrollment] = useState<{ enrollment: Enrollment; index: number } | null>(null); // Track the enrollment being edited
      const [searchQuery, setSearchQuery] = useState(''); // State for search query
      // const [ordId, setOrdId] = useState([]); // State for organization unit ID
      
      const handleSchoolChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
          setSelectedSchool(event.target.value);
      };
  
      const handleEnrollStudentClick = () => {
          setEditingEnrollment(null); // Clear editing state for new enrollment
          setShowEnrollmentForm(true);
      };
  
      const handleCloseForm = () => {
          setShowEnrollmentForm(false);
      };
  
      const handleFormSubmit = (formData: Enrollment) => {
          if (editingEnrollment) {
              // Update the existing enrollment
              const updatedEnrollments = enrollments.map((enrollment, i) =>
                  i === editingEnrollment?.index ? formData : enrollment
              );
              setEnrollments(updatedEnrollments);
              setEditingEnrollment(null); // Clear editing state
          } else {
              // Add a new enrollment
              setEnrollments([...enrollments, formData]);
          }
          setShowEnrollmentForm(false); // Close the form
      };
  
    const handleEditClick = (enrollment: Enrollment, index: number) => {
        setEditingEnrollment({ enrollment, index }); // Store the enrollment and its index
        setShowEnrollmentForm(true); // Open the form
    };
  
      const filteredEnrollments = enrollments.filter((enrollment) =>
          `${enrollment.firstName} ${enrollment.surname} ${enrollment.programOfStudy} ${enrollment.yearOfStudy}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
      // useEffect(() => { 
      //      setOrdId( fetchOrganisationUnits())
      //      console.log(ordId)
      //   },[ordId])
  
      return (
          <div style={{ padding: '10px', position: 'relative' }}>
              {/* Modal for Enrollment Form */}
              {showEnrollmentForm && (
                  <div
                      style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 1000,
                      }}
                  >
                      <div
                          style={{
                              backgroundColor: '#fff',
                              borderRadius: '10px',
                              padding: '20px',
                              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                              maxWidth: '700px',
                              width: '90%',
                              maxHeight: '90vh',
                              overflowY: 'auto',
                              position: 'relative',
                          }}
                      >
                          {/* Close Button */}
                          <button
                              style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '10px',
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  color: '#f44336',
                                  fontSize: '20px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                              }}
                              onClick={handleCloseForm}
                          >
                              &times;
                          </button>
  
                          {/* Enrollment Form Component */}
                          <EnrollmentForm
                              school={selectedSchool}
                              onSubmit={handleFormSubmit}
                              editingEnrollment={editingEnrollment} // Pass the editing enrollment
                          />
                      </div>
                  </div>
              )}
  
              {/* Main Content */}
              {!showEnrollmentForm && (
                  <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', fontSize: '18px', fontFamily: 'Roboto, sans-serif' }}>
                          <div>
                              <label>
                                  School
                                  <select style={{ marginLeft: '10px' }} onChange={handleSchoolChange}>
                                      <option value="">Select a school</option>
                                      {/* {["UNIMA", "MUBAS", "LUANAR", "MUST", "MZUNI", "KUHES"].map((school) => (
                                          <option key={school} value={school}>
                                              {school}
                                          </option>
                                      ))} */}
                           {/* { ordId.map(item => {
                          const li = document.createElement('li');
                          li.textContent = `${item.name} (${item.id})`;
                          li.style.cursor = 'pointer';
  
                          li.onclick = () => {
                          ordId=item.id
                          // listTrackedEntityInstances(ordId)
                          console.log(`Name: ${item.name}, ID: ${item.id}`);
                              };
                          }
                            )} */}
                                  </select>
                              </label>
                          </div>
                          <div style={{ marginLeft: '20px' }}>
                              <label>
                                  Grade
                                  <select style={{ marginLeft: '10px' }}>
                                      <option>Select a year</option>
                                      {[1, 2, 3, 4, 5].map((grade) => (
                                          <option key={grade} value={grade}>
                                              {grade}
                                          </option>
                                      ))}
                                  </select>
                              </label>
                          </div>
                          <div style={{ marginLeft: '20px' }}>
                              <label>
                                  Program
                                  <select style={{ marginLeft: '10px' }}>
                                      <option>Program of Study</option>
                                      {["Computer Science", "Statistics", "Political Science", "Bachelor of Arts", "Information System"].map((program) => (
                                          <option key={program} value={program}>
                                              {program}
                                          </option>
                                      ))}
                                  </select>
                              </label>
                          </div>
                          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                              <span style={{ fontWeight: 'bold' }}>Academic Year</span>
                              <span style={{ color: 'red', marginLeft: '5px' }}>2025</span>
                          </div>
                      </div>
                  </div>
              )}
  
              {/* Enrollments Section */}
              {selectedSchool && !showEnrollmentForm ? (
                  <div style={{ marginTop: '20px' }}>
                      <h2>Enrollments</h2>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                          {/* Search Student */}
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <input
                                  type="text"
                                  placeholder="Search Student"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', paddingLeft: '30px' }}
                              />
                              <FontAwesomeIcon
                                  icon={faSearch}
                                  style={{ position: 'absolute', left: '10px', color: '#ccc' }}
                              />
                          </div>
  
                          {/* Buttons */}
                          <button style={{ padding: '5px 10px' }} onClick={handleEnrollStudentClick}>
                              <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '5px' }} />
                              Enroll Student
                          </button>
                          <button style={{ padding: '5px 10px' }}>
                              <FontAwesomeIcon icon={faDownload} style={{ marginRight: '5px' }} />
                              Download PDF
                          </button>
                      </div>
  
                      {/* Display Enrollments in a Table */}
                      {filteredEnrollments.length > 0 ? (
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
              <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Reg Number</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>First Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Surname</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>School</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Program Of Study</th>
                  {/* <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date of Birth</th> */}
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Year of Study</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nationality</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Gender</th>
                  {/* <th style={{ border: '1px solid #ccc', padding: '8px' }}>Guardian's Name</th> */}
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Profile Picture</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
              </tr>
          </thead>
          <tbody>
              {filteredEnrollments.map((enrollment, index) => (
                  <tr key={index}>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.regNumber}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.firstName}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.surname}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.school}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.programOfStudy}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.yearOfStudy}</td>
                      {/* <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.dateOfBirth?.toLocaleDateString()}</td> */}
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.nationality}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.gender}</td>
                      {/* <td style={{ border: '1px solid #ccc', padding: '8px' }}>{enrollment.guardianName}</td> */}
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                          <img
                              src={enrollment.profilePicture || 'https://via.placeholder.com/50'}
                              alt="Profile"
                              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                          <button
                              style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  marginRight: '10px',
                              }}
                              onClick={() => handleEditClick(enrollment, index)} // Edit button handler
                          >
                              <FontAwesomeIcon icon={faPen} style={{ color: '#4caf50' }} />
                          </button>
                          <button
                              style={{
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                              }}
                              onClick={() => {
                                  const confirmDelete = window.confirm('Are you sure you want to delete this enrollment?');
                                  if (confirmDelete) {
                                      const updatedEnrollments = enrollments.filter((_, i) => i !== index);
                                      setEnrollments(updatedEnrollments);
                                  }
                              }}
                          >
                              <FontAwesomeIcon icon={faTrash} style={{ color: '#f44336' }} />
                          </button>
                      </td>
                  </tr>
              ))}
          </tbody>
      </table>
  ) : (
      searchQuery && (
          <div
          style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontStyle: 'italic',
              marginTop: '40px',
              fontSize: '1.3rem',
          }}
      >
          No Student or any Information match your search.
      </div>
  )
  
  )}
                
                  </div>
              ) : (
                  <div
                      style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          height: '100vh',
                          fontSize: '1rem',
                          fontFamily: 'Roboto, sans-serif',
                          backgroundColor: '#f4f4f4',
                          padding: '20px',
                      }}
                  >
                      <div
                          style={{
                              padding: '20px',
                              backgroundColor: '#fff',
                              borderRadius: '10px',
                              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                              maxWidth: '700px',
                              width: '90%',
                              textAlign: 'left',
                              minHeight: '200px',
                              marginTop: '100px',
                          }}
                      >
                          <h3>SEMIS-Enrollment</h3>
                          <p>Follow the instructions to proceed:</p>
                          <ul>
                              <li>Select the Organization unit you want to view data</li>
                              <li>Use global filters (Class, Grade, and Academic Year)</li>
                          </ul>
                      </div>
                  </div>
              )}
          </div>
      );  
    // return (
    //     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    //         <h1>DHIS2 Enrollment</h1>
    //         <form style={{ maxWidth: "600px", margin: "0 auto" }}>
    //             <div style={{ marginBottom: "15px" }}>
    //                 <label htmlFor="program" style={{ display: "block", marginBottom: "5px" }}>
    //                     Program
    //                 </label>
    //                 <select id="program" name="program" style={{ width: "100%", padding: "8px" }}>
    //                     <option value="">Select a program</option>
    //                     <option value="program1">Program 1</option>
    //                     <option value="program2">Program 2</option>
    //                 </select>
    //             </div>
    //             <div style={{ marginBottom: "15px" }}>
    //                 <label htmlFor="orgUnit" style={{ display: "block", marginBottom: "5px" }}>
    //                     Organisation Unit
    //                 </label>
    //                 <input
    //                     type="text"
    //                     id="orgUnit"
    //                     name="orgUnit"
    //                     placeholder="Enter organisation unit"
    //                     style={{ width: "100%", padding: "8px" }}
    //                 />
    //             </div>
    //             <div style={{ marginBottom: "15px" }}>
    //                 <label htmlFor="enrollmentDate" style={{ display: "block", marginBottom: "5px" }}>
    //                     Enrollment Date
    //                 </label>
    //                 <input
    //                     type="date"
    //                     id="enrollmentDate"
    //                     name="enrollmentDate"
    //                     style={{ width: "100%", padding: "8px" }}
    //                 />
    //             </div>
    //             <div style={{ marginBottom: "15px" }}>
    //                 <label htmlFor="incidentDate" style={{ display: "block", marginBottom: "5px" }}>
    //                     Incident Date
    //                 </label>
    //                 <input
    //                     type="date"
    //                     id="incidentDate"
    //                     name="incidentDate"
    //                     style={{ width: "100%", padding: "8px" }}
    //                 />
    //             </div>
    //             <button
    //                 type="submit"
    //                 style={{
    //                     backgroundColor: "#007bff",
    //                     color: "#fff",
    //                     padding: "10px 15px",
    //                     border: "none",
    //                     borderRadius: "5px",
    //                     cursor: "pointer",
    //                 }}
    //             >
    //                 Enroll
    //             </button>
    //         </form>
    //     </div>
    // );
};

export default EnrollmentPage;