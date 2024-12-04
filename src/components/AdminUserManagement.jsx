// src/components/AdminUserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUserManagement.css';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users', newUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers([...users, response.data]);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'user',
      });
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  return (
    <div className="admin-user-management">
      <h2>Admin User Management</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleInputChange}
          placeholder="User Name"
          required
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleInputChange}
          placeholder="User Email"
          required
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="User Password"
          required
        />
        <select name="role" value={newUser.role} onChange={handleInputChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <h3>Existing Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <h4>{user.name}</h4>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUserManagement;