import React from 'react';
// import './SaveFailedDialog.css'; // Optional: add custom styles

export default function SaveFailedDialog({ isOpen, onRetry, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <h3>Save Failed</h3>
                <p>Failed to save session. Please try again.</p>
                <div className="dialog-actions">
                    <button onClick={onRetry}>Retry</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
