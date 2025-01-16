import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPersonCircle, BsExclamationTriangle } from 'react-icons/bs';
import { parseJwt } from '../../utils/auth';
import '../../styles/Profile.css';

interface UpdateResponse {
  success: boolean;
  message: string;
  token?: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState({
    username: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [updateStatus, setUpdateStatus] = useState<{
    loading: boolean;
    error: string;
    success: string;
  }>({
    loading: false,
    error: '',
    success: ''
  });

  const [deleteStatus, setDeleteStatus] = useState({
    loading: false,
    error: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const claims = parseJwt(token);
      setPersonalInfo({
        username: claims.name || '',
        email: claims.email || ''
      });
      setUserId(claims.nameidentifier);
    }
  }, []);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus({ loading: true, error: '', success: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:7000/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          newUsername: personalInfo.username.trim(),
          newEmail: personalInfo.email.trim()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Failed to update profile';
        } catch {
          errorMessage = errorText || 'Failed to update profile';
        }
        throw new Error(errorMessage);
      }

      // If the response is successful, try to parse it as JSON
      let data: UpdateResponse;
      try {
        data = await response.json();
      } catch {
        // If response can't be parsed as JSON but status is OK, consider it a success
        data = { success: true, message: 'Profile updated successfully' };
      }

      // Update local storage and state with new information
      if (data.token) {
        localStorage.setItem('token', data.token);
        const newClaims = parseJwt(data.token);
        setPersonalInfo({
          username: newClaims.name || '',
          email: newClaims.email || ''
        });
        setUserId(newClaims.nameidentifier);
      }

      setUpdateStatus({
        loading: false,
        error: '',
        success: 'Profile updated successfully! You will be redirected to login...'
      });

      // Set a timeout to show the success message before redirecting
      setTimeout(() => {
        // Clear all auth data
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // Redirect to login page
        navigate('/signin', { replace: true });
      }, 2000);

    } catch (err) {
      setUpdateStatus({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to update profile',
        success: ''
      });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Password update logic will be implemented later
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteStatus({ loading: true, error: '' });
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:7000/auth/delete-account/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      
      // Redirect to signup page
      navigate('/signup', { 
        state: { message: 'Your account has been successfully deleted.' }
      });

    } catch (err) {
      setDeleteStatus({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to delete account'
      });
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <BsPersonCircle className="profile-icon" />
        <h1>Profile Settings</h1>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          {/* Personal Information Form */}
          <div className="form-section">
            <h2>Personal Information</h2>
            {updateStatus.error && <div className="alert alert-error">{updateStatus.error}</div>}
            {updateStatus.success && <div className="alert alert-success">{updateStatus.success}</div>}
            <form onSubmit={handlePersonalInfoSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={personalInfo.username}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, username: e.target.value })}
                  disabled={updateStatus.loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  disabled={updateStatus.loading}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="submit-button"
                disabled={updateStatus.loading}
              >
                {updateStatus.loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="form-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  placeholder="Enter your current password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter your new password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                />
              </div>
              <button type="submit" className="submit-button">
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="profile-sidebar">
          <div className="form-section delete-account-section">
            <h2>Delete Account</h2>
            <div className="delete-account-content">
              <div className="delete-warning">
                <BsExclamationTriangle className="warning-icon" />
                <p>Warning: This action cannot be undone. All your data will be permanently deleted.</p>
              </div>
              {deleteStatus.error && <div className="alert alert-error">{deleteStatus.error}</div>}
              {!showDeleteConfirm ? (
                <button 
                  className="delete-account-button"
                  onClick={() => setShowDeleteConfirm(true)}
                  type="button"
                >
                  Delete Account
                </button>
              ) : (
                <div className="delete-confirm">
                  <p>Are you sure you want to delete your account?</p>
                  <div className="delete-confirm-buttons">
                    <button 
                      className="delete-confirm-button"
                      onClick={handleDeleteAccount}
                      disabled={deleteStatus.loading}
                      type="button"
                    >
                      {deleteStatus.loading ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                    <button 
                      className="delete-cancel-button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleteStatus.loading}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
