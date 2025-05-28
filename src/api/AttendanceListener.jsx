import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); 

const AttendanceListener = () => {
  const [sessionStudents, setSessionStudents] = useState([]);
  const [attendanceEnded, setAttendanceEnded] = useState(false);
  const [examId, setExamId] = useState(null);

  useEffect(() => {
    // Handle real-time student marking
    socket.on('studentMarked', (data) => {
      setSessionStudents(prev => {
        const exists = prev.find(s => s.registrationNumber === data.registrationNumber && s.examId === data.examId);
        if (exists) return prev;

        setExamId(data.examId);
        return [...prev, data];
      });
    });

    // When attendance ends
    socket.on('attendanceEnded', (data) => {
      setAttendanceEnded(true);
      // send sessionStudents to backend for storage/reporting
      console.log('Attendance session ended. Final student list:', sessionStudents);
    });

    return () => {
      socket.off('studentMarked');
      socket.off('attendanceEnded');
    };
  }, [sessionStudents]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Live Attendance Session {examId ? `(Exam: ${examId})` : ''}
      </h2>

      <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Registration No.</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {sessionStudents.map((student, index) => (
            <tr key={`${student.registrationNumber}-${student.examId}`} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{student.name}</td>
              <td className="px-4 py-2 border">{student.registrationNumber}</td>
              <td className={`px-4 py-2 border font-semibold ${getStatusColor(student.status)}`}>
                {student.status}
              </td>
              <td className="px-4 py-2 border">{new Date(student.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!sessionStudents.length && (
        <p className="text-gray-500 text-center mt-4">Waiting for students to be marked...</p>
      )}

      {attendanceEnded && (
        <div className="mt-6 text-center">
          <p className="text-green-700 font-medium text-lg">Attendance Session Complete</p>
          {/* Optional button to save or export session */}
        </div>
      )}
    </div>
  );
};

// Optional status color utility
const getStatusColor = (status) => {
  switch (status) {
    case 'present':
      return 'text-green-600';
    case 'absent':
      return 'text-red-600';
    case 'late':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

export default AttendanceListener;

