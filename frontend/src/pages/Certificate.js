import React from 'react';
import './Certificate.css'; // Ensure correct import path

const Certificate = ({ name, rollNumber }) => {
  return (
    <div className="certificate-background">
      <div className="certificate-content">
        <div className="certificate-text">
          <h2 className="certificate-name">Ayush Ranjan</h2>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
