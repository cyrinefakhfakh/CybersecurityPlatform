import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-menu">
        <Link to="/admin/courses" className="admin-menu-item">
          <h2>Course Management</h2>
          <p>Add, edit, or remove courses</p>
        </Link>
        <Link to="/admin/users" className="admin-menu-item">
          <h2>User Management</h2>
          <p>Manage user accounts and permissions</p>
        </Link>
        {/* Add more admin sections as needed */}
      </div>
    </div>
  );
}

export default AdminDashboard;