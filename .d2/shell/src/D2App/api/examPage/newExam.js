// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './exam.css';
// import { Divider } from '@material-ui/core';

// const NewExam = () => {
//     const [filter, setFilter] = useState('');
//     const [exams, setExams] = useState([
//         { 
//             id: 1, 
//             courseName: 'SCE 421', 
//             date: '2023-10-01', 
//             room: '101', 
//             supervisorName: 'Joshua Judge', 
//             startTime: '09:00', 
//             endTime: '11:00' 
//         },
//         { 
//             id: 2, 
//             courseName: 'COM 211', 
//             date: '2023-09-15', 
//             room: '202', 
//             supervisorName: 'Isaac Mwakabila', 
//             startTime: '10:00', 
//             endTime: '12:00' 
//         },
//         { 
//             id: 3, 
//             courseName: 'MAT 211', 
//             date: '2023-08-20', 
//             room: '303', 
//             supervisorName: 'Alice Namagale', 
//             startTime: '13:00', 
//             endTime: '15:00' 
//         },
//     ]);
//     const [showPopup, setShowPopup] = useState(false);
//     const [newExam, setNewExam] = useState({ 
//         courseName: '', 
//         date: '', 
//         room: '', 
//         supervisorName: '', 
//         startTime: '', 
//         endTime: '' 
//     });
//     const navigate = useNavigate();

//     const filteredExams = exams.filter(
//         (exam) =>
//             exam.courseName.toLowerCase().includes(filter.toLowerCase()) ||
//             exam.date.includes(filter)
//     );

//     const handleCreateExam = () => {
//         // console.log(newExam)
//         setShowPopup(false);
//         navigate('/api/examPage/select-students', {
//             state: newExam 
//         });
//     };

//     return (
//         <div className="exam-container">
//             <div className="header">
//                 <h1 style={{ color: '#101345' }}>Exam Summary</h1>
//                 <div className="search-box">
//                     <input
//                         type="text"
//                         placeholder="Search by course name or date..."
//                         value={filter}
//                         onChange={(e) => setFilter(e.target.value)}
//                         style={{ color: '#101345', backgroundColor: 'white', border: '1px solid #101345' }}
//                     />
//                     <button 
//                         style={{
//                             backgroundColor: 'darkblue',
//                             color: 'white',
//                         }}
//                         className="primary-btn"
//                         onClick={() => setShowPopup(true)}
//                         // style={{ color: '#101345', backgroundColor: 'white', border: '1px solid #101345' }}
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//                             <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
//                         </svg>
//                         New
//                     </button>
//                 </div>
//             </div>
//             <Divider />
//             <p style={{marginTop:'2rem'}}>Below is a summary of past exams. You can view details or create a new exam using the options provided.</p>
//             <div className="card-container">

//                 {filteredExams.length > 0 ? (
//                     filteredExams.map((exam) => (
//                         <div key={exam.id} className="exam-card">
//                             <h3 style={{alignItems:'center',color:'black'}}>{exam.courseName}</h3>
//                             <Divider />
//                             <section style={{color:'black'}}>
//                                 <p className='p1'>
//                                     <strong style={{ color: 'black' }}>Date:</strong>{' '}
//                                     {new Date(exam.date).toLocaleDateString('en-US', {
//                                         year: 'numeric',
//                                         month: 'long',
//                                         day: 'numeric',
//                                     })}
//                                 </p>
//                                 <p className='p1'>
//                                     <strong style={{ color: 'black' }}>Room:</strong> {exam.room}
//                                 </p>
//                                 <p className='p1'>
//                                     <strong style={{ color: 'black' }}>Supervisor:</strong> {exam.supervisorName}
//                                 </p>
//                                 <p className='p'>
//                                     <strong style={{ color: 'black' }}>Time:</strong> {exam.startTime} - {exam.endTime}
//                                 </p>
//                             </section>
//                             {/* <p className='p1'>
//                                 <strong className='p1'>Date:</strong>{' '}
//                                 {new Date(exam.date).toLocaleDateString('en-US', {
//                                     year: 'numeric',
//                                     month: 'long',
//                                     day: 'numeric',
//                                 })}
//                             </p>
//                             <p className='p1'>
//                                 <strong className='p1'>Room:</strong> {exam.room}
//                             </p>
//                             <p className='p1'>
//                                 <strong className='p1'>Supervisor:</strong> {exam.supervisorName}
//                             </p>
//                             <p className='p'>
//                                 <strong className='p1'>Time:</strong> {exam.startTime} - {exam.endTime}
//                             </p> */}
//                             {/* <button
//                                 style={{
//                                     color: 'white'
//                                 }}
//                                 className="secondary-btn"
//                                 onClick={() => navigate('/api/reports/report', {
//                                     state: { exam }
//                                 })}
//                             >
//                                 View
//                             </button> */}
//                         </div>
//                     ))
//                 ) : (
//                     <div className="empty-state">
//                         <p>No exams found matching your search criteria.</p>
//                     </div>
//                 )}
//             </div>

//             {showPopup && (
//                 <div className="popup">
//                     <div className="popup-content">
//                         <h2 style={{color: 'black'}}>Create New Exam</h2>
//                         <form
//                             onSubmit={(e) => {
//                                 e.preventDefault();
//                                 handleCreateExam();
//                             }}
//                         >

//                             <div className="form-group">
//                                 <label style={{ color: 'black' }} >Course Name</label>
//                                 <input
//                                     type="text"
//                                     value={newExam.courseName}
//                                     onChange={(e) =>
//                                         setNewExam({ ...newExam, courseName: e.target.value })
//                                     }
//                                     required
//                                     placeholder="Enter course name"
//                                 />
//                             </div>

//                             <div className="form-row">
//                                 <div className="form-group">
//                                     <label style={{ color: 'black' }} >Date</label>
//                                     <input
//                                         type="date"
//                                         value={newExam.date}
//                                         onChange={(e) =>
//                                             setNewExam({ ...newExam, date: e.target.value })
//                                         }
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label style={{ color: 'black' }} >Room</label>
//                                     <input
//                                         type="text"
//                                         value={newExam.room}
//                                         onChange={(e) =>
//                                             setNewExam({ ...newExam, room: e.target.value })
//                                         }
//                                         required
//                                         placeholder="Room number"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="form-group">
//                                 <label style={{ color: 'black' }} >Supervisor Name</label>
//                                 <input
//                                     type="text"
//                                     value={newExam.supervisorName}
//                                     onChange={(e) =>
//                                         setNewExam({ ...newExam, supervisorName: e.target.value })
//                                     }
//                                     required
//                                     placeholder="Enter supervisor's name"
//                                 />
//                             </div>

//                             <div className="form-row">
//                                 <div className="form-group">
//                                     <label style={{ color: 'black' }} >Start Time</label>
//                                     <input
//                                         type="time"
//                                         value={newExam.startTime}
//                                         onChange={(e) =>
//                                             setNewExam({ ...newExam, startTime: e.target.value })
//                                         }
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label style={{ color: 'black' }} >End Time</label>
//                                     <input
//                                         type="time"
//                                         value={newExam.endTime}
//                                         onChange={(e) =>
//                                             setNewExam({ ...newExam, endTime: e.target.value })
//                                         }
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <div className="form-actions">
//                                 <button
//                                     type="button"
//                                     className="primary-btn"
//                                     onClick={() => setShowPopup(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="primary-btn"
//                                 >
//                                     Create Exam
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default NewExam;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './exam.css';
import { Divider } from '@material-ui/core';
const NewExam = () => {
  const [filter, setFilter] = useState('');
  const [exams, setExams] = useState([{
    id: 1,
    courseName: 'SCE 421',
    date: '2023-10-01',
    room: '101',
    supervisorName: 'Joshua Judge',
    startTime: '09:00',
    endTime: '11:00'
  }, {
    id: 2,
    courseName: 'COM 211',
    date: '2023-09-15',
    room: '202',
    supervisorName: 'Isaac Mwakabila',
    startTime: '10:00',
    endTime: '12:00'
  }, {
    id: 3,
    courseName: 'MAT 211',
    date: '2023-08-20',
    room: '303',
    supervisorName: 'Alice Namagale',
    startTime: '13:00',
    endTime: '15:00'
  }]);
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
  const filteredExams = exams.filter(exam => exam.courseName.toLowerCase().includes(filter.toLowerCase()) || exam.date.includes(filter));
  const handleCreateExam = () => {
    console.log("Form Data Submitted:", newExam); // Added console.log here
    setShowPopup(false);
    navigate('/api/examPage/select-students', {
      state: newExam
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "exam-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#101345'
    }
  }, "Exam Summary"), /*#__PURE__*/React.createElement("div", {
    className: "search-box"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search by course name or date...",
    value: filter,
    onChange: e => setFilter(e.target.value),
    style: {
      color: '#101345',
      backgroundColor: 'white',
      border: '1px solid #101345'
    }
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      backgroundColor: 'darkblue',
      color: 'white'
    },
    className: "primary-btn",
    onClick: () => setShowPopup(true)
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    fill: "currentColor",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
  })), "New"))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '2rem'
    }
  }, "Below is a summary of past exams. You can view details or create a new exam using the options provided."), /*#__PURE__*/React.createElement("div", {
    className: "card-container"
  }, filteredExams.length > 0 ? filteredExams.map(exam => /*#__PURE__*/React.createElement("div", {
    key: exam.id,
    className: "exam-card"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      alignItems: 'center',
      color: 'black'
    }
  }, exam.courseName), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("section", {
    style: {
      color: 'black'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "p1"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'black'
    }
  }, "Date:"), ' ', new Date(exam.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })), /*#__PURE__*/React.createElement("p", {
    className: "p1"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'black'
    }
  }, "Room:"), " ", exam.room), /*#__PURE__*/React.createElement("p", {
    className: "p1"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'black'
    }
  }, "Supervisor:"), " ", exam.supervisorName), /*#__PURE__*/React.createElement("p", {
    className: "p"
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'black'
    }
  }, "Time:"), " ", exam.startTime, " - ", exam.endTime)), /*#__PURE__*/React.createElement("button", {
    style: {
      color: 'white'
    },
    className: "secondary-btn",
    onClick: () => navigate('/api/reports/report', {
      state: {
        exam
      }
    })
  }, "View"))) : /*#__PURE__*/React.createElement("div", {
    className: "empty-state"
  }, /*#__PURE__*/React.createElement("p", null, "No exams found matching your search criteria."))), showPopup && /*#__PURE__*/React.createElement("div", {
    className: "popup"
  }, /*#__PURE__*/React.createElement("div", {
    className: "popup-content"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: 'black'
    }
  }, "Create New Exam"), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      handleCreateExam();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      color: 'black'
    }
  }, "Course Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newExam.courseName,
    onChange: e => setNewExam({
      ...newExam,
      courseName: e.target.value
    }),
    required: true,
    placeholder: "Enter course name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      color: 'black'
    }
  }, "Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: newExam.date,
    onChange: e => setNewExam({
      ...newExam,
      date: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      color: 'black'
    }
  }, "Room"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newExam.room,
    onChange: e => setNewExam({
      ...newExam,
      room: e.target.value
    }),
    required: true,
    placeholder: "Room number"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      color: 'black'
    }
  }, "Supervisor Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newExam.supervisorName,
    onChange: e => setNewExam({
      ...newExam,
      supervisorName: e.target.value
    }),
    required: true,
    placeholder: "Enter supervisor's name"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      color: 'black'
    }
  }, "Start Time"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: newExam.startTime,
    onChange: e => setNewExam({
      ...newExam,
      startTime: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      color: 'black'
    }
  }, "End Time"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: newExam.endTime,
    onChange: e => setNewExam({
      ...newExam,
      endTime: e.target.value
    }),
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "primary-btn",
    onClick: () => setShowPopup(false)
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "primary-btn"
  }, "Create Exam"))))));
};
export default NewExam;