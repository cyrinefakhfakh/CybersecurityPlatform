import React, { useState, useEffect, useRef } from 'react';
import { Shield, Award, Book, User, Mail, Calendar, Edit2, Save, X, MapPin, Briefcase, Camera } from 'lucide-react';
import './Profile.css';
import AvatarUploadSection from './AvatarUploadSection';
export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    occupation: '',
    joinDate: ''
  });
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      setUploadProgress(0);

      const response = await fetch('http://localhost:5000/api/auth/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (!response.ok) throw new Error('Failed to upload photo');
      
      const data = await response.json();
      setUser(prevUser => ({
        ...prevUser,
        avatar: data.avatarUrl
      }));
      
      setSuccessMessage('Profile photo updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to upload profile photo');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUser(data);
        setEditForm({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || '',
          occupation: data.occupation || '',
          joinDate: data.joinDate || new Date().toISOString().split('T')[0]
        });
        setLoading(false);
      } catch (error) {
        setError('Error loading profile data');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = [
    { icon: Book, label: 'Courses Enrolled', value: courses.length },
    { icon: Award, label: 'Certificates Earned', value: certificates.length },
    { icon: Shield, label: 'Days Active', value: user?.daysActive || 0 }
  ];

  return (
    <div className="profile-container">
      {error && (
        <div className="alert alert-error">{error}</div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="card">
        <div className="card-content">
          <div className="profile-header">
          <AvatarUploadSection 
            user={user}
            onUpdateAvatar={(avatarUrl) => {
              setUser(prev => ({ ...prev, avatar: avatarUrl }));
              setSuccessMessage('Profile photo updated successfully!');
              setTimeout(() => setSuccessMessage(''), 3000);
            }}
            onError={setError}
          />

            {!isEditing ? (
              <div className="profile-info">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="profile-name">{user?.name || 'Welcome Back!'}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="button button-secondary"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Profile
                  </button>
                </div>
                <div className="info-list">
                  <div className="info-item">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </div>
                  {user?.location && (
                    <div className="info-item">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                  )}
                  {user?.occupation && (
                    <div className="info-item">
                      <Briefcase className="w-4 h-4" />
                      {user.occupation}
                    </div>
                  )}
                  {user?.joinDate && (
                    <div className="info-item">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                  )}
                  {user?.bio && (
                    <p className="mt-4 text-gray-600">{user.bio}</p>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-grid">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="input"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    placeholder="Your email"
                    className="input"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className="input"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="input"
                  />
                  <input
                    type="text"
                    name="occupation"
                    value={editForm.occupation}
                    onChange={handleInputChange}
                    placeholder="Occupation"
                    className="input"
                  />
                </div>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  className="textarea"
                />
                <div className="flex gap-2">
                  <button type="submit" className="button button-primary">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="button button-secondary"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>)}
            
<div className="tabs">
  <div className="tabs-list">
    <button
      className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
      onClick={() => setActiveTab('overview')}
    >
      Overview
    </button>
    <button
      className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
      onClick={() => setActiveTab('courses')}
    >
      Courses
    </button>
    <button
      className={`tab ${activeTab === 'certificates' ? 'active' : ''}`}
      onClick={() => setActiveTab('certificates')}
    >
      Certificates
    </button>
  </div>

  {activeTab === 'overview' && (
    <div className="stats-grid">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        );
      })}
    </div>
  )}

  {activeTab === 'courses' && (
    <div className="courses-list">
      {courses.length > 0 ? (
        courses.map((course) => (
          <div key={course.id} className="item-card">
            <div>
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
            <div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {course.progress}% Complete
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No courses enrolled yet.</p>
          <button className="button button-primary mt-4">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  )}

  {activeTab === 'certificates' && (
    <div className="certificates-list">
      {certificates.length > 0 ? (
        certificates.map((certificate) => (
          <div key={certificate.id} className="item-card">
            <div>
              <h3 className="text-lg font-semibold">
                {certificate.title}
              </h3>
              <p className="text-sm text-gray-600">
                Issued on {new Date(certificate.issueDate).toLocaleDateString()}
              </p>
            </div>
            <button
              className="button button-secondary"
              onClick={() => window.open(certificate.pdfUrl, '_blank')}
            >
              <Award className="w-4 h-4" />
              View Certificate
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No certificates earned yet.</p>
          <p className="text-sm mt-2">
            Complete courses to earn certificates!
          </p>
        </div>
      )}
    </div>
  )}
</div>
</div>
</div>
</div>
</div>
);
}