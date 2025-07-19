import React from 'react';

const PatientDashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <h1>لوحة المريض</h1>
      <p>مرحباً بك {user.firstName} {user.lastName}</p>
      {/* محتوى لوحة المريض */}
    </div>
  );
};

export default PatientDashboard;