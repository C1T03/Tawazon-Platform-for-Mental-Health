import React from 'react';

const TherapistDashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <h1>لوحة المعالج</h1>
      <p>مرحباً بك {user.firstName} {user.lastName}</p>
      {/* محتوى لوحة المعالج */}
    </div>
  );
};

export default TherapistDashboard;