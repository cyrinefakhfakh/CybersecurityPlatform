import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import axios from 'axios';

const AvatarUploadSection = ({ user, onUpdateAvatar, onError }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      onError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        'http://localhost:5000/api/auth/upload-avatar', // Updated to match backend route
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      onUpdateAvatar(response.data.avatar);
      setUploadProgress(0);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload profile photo';
      onError(errorMessage);
      
      // Log detailed error information for debugging
      console.error('Avatar upload failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className="avatar-container relative"
      role="region"
      aria-label="Profile photo upload section"
    >
      <div className="avatar">
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={`${user.name || 'User'}'s profile`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div 
            className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center"
            role="img"
            aria-label="Default profile placeholder"
          >
            <Camera className="w-8 h-8 text-gray-400" aria-hidden="true" />
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
        id="avatar-upload"
        aria-label="Choose profile photo"
        title="Choose profile photo"
      />
      
      <button 
        className="avatar-upload-button absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        aria-label="Upload new profile photo"
        title="Upload new profile photo"
      >
        <Camera className="w-4 h-4 text-gray-600" aria-hidden="true" />
        <span className="sr-only">Upload new profile photo</span>
      </button>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full"
          role="progressbar"
          aria-valuenow={uploadProgress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Upload progress"
        >
          <div className="text-white text-sm font-medium">
            {uploadProgress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUploadSection;