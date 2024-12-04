import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './components/CourseDetail';
import Tests from './pages/Tests';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourseManagement from './components/AdminCourseManagement';
import AdminUserManagement from './components/AdminUserManagement';
import PrivateAdminRoute from './components/PrivateAdminRoute';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'admin');

  const handleAuthentication = (isAdmin) => {
    setIsAuthenticated(true);
    setIsAdmin(isAdmin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp onAuth={handleAuthentication} />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onAuth={handleAuthentication} />} />
        <Route path="*" element={<NotFound />} />
        <Route 
          path="/admin" 
          element={
            
              <AdminDashboard />
            
          } 
        />
        <Route 
          path="/admin/courses" 
          element={
            
              <AdminCourseManagement />
            
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <PrivateAdminRoute>
              <AdminUserManagement />
            </PrivateAdminRoute>
          } 
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;