import React from 'react';
// import './report.css'; // Optional: Add styles in a separate CSS file if needed

const Report = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.text}>Report Component Coming Soon</h1>
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