import './AdminDashboard.css';
import React from 'react';
import { Link } from 'react-router-dom';

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, 
  Book, 
  TrendingUp, 
  Activity, 
  Database 
} from 'lucide-react';

function AdminDashboard() {
  const courseEnrollmentData = [
    { month: 'Jan', enrollments: 400 },
    { month: 'Feb', enrollments: 300 },
    { month: 'Mar', enrollments: 500 },
    { month: 'Apr', enrollments: 450 },
    { month: 'May', enrollments: 600 },
    { month: 'Jun', enrollments: 550 },
  ];

  const userTypeData = [
    { name: 'Students', value: 450 },
    { name: 'Instructors', value: 100 },
    { name: 'Admins', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const kpiData = [
    { 
      icon: <Users />, 
      title: 'Total Users', 
      value: '570',
      change: '+12%',
      iconColor: 'text-blue-500'
    },
    { 
      icon: <Book />, 
      title: 'Total Courses', 
      value: '45',
      change: '+5%',
      iconColor: 'text-green-500'
    },
    { 
      icon: <TrendingUp />, 
      title: 'Active Courses', 
      value: '32',
      change: '+8%',
      iconColor: 'text-purple-500'
    },
    { 
      icon: <Activity />, 
      title: 'Avg. Completion Rate', 
      value: '72%',
      change: '+3%',
      iconColor: 'text-red-500'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      {/* KPI Section */}
      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className={`kpi-icon ${kpi.iconColor}`}>
              {React.cloneElement(kpi.icon, { className: 'w-6 h-6' })}
            </div>
            <div className="kpi-content">
              <p className="kpi-title">{kpi.title}</p>
              <div className="flex items-center">
                <span className="kpi-value">{kpi.value}</span>
                <span className="kpi-change text-green-500">{kpi.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        <div className="chart-card">
          <h2 className="chart-title">Course Enrollments</h2>
          <LineChart width={500} height={300} data={courseEnrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="enrollments" stroke="#8884d8" />
          </LineChart>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">User Types Distribution</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={userTypeData}
              cx={250}
              cy={150}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {userTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions">
        <div className="action-card">
          <h2>Course Management</h2>
          <div className="space-y-2">
            <Link 
              to="/admin/courses/add" 
              className="action-link"
            >
              <Book className="action-link-icon text-blue-600" />
              <span>Add New Course</span>
            </Link>
            <Link 
              to="/admin/courses/manage" 
              className="action-link"
            >
              <Database className="action-link-icon text-green-600" />
              <span>Manage Existing Courses</span>
            </Link>
          </div>
        </div>

        <div className="action-card">
          <h2>User Management</h2>
          <div className="space-y-2">
            <Link 
              to="/admin/users/add" 
              className="action-link"
            >
              <Users className="action-link-icon text-purple-600" />
              <span>Add New User</span>
            </Link>
            <Link 
              to="/admin/users/manage" 
              className="action-link"
            >
              <Activity className="action-link-icon text-indigo-600" />
              <span>Manage User Permissions</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;