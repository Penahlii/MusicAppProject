import { FC, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiHomeAlt, BiUpload, BiLibrary, BiUser } from 'react-icons/bi';
import { MdFavorite } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { BsMusicNote } from 'react-icons/bs';
import { parseJwt } from '../../utils/auth';
import '../../styles/Sidebar.css';

interface SidebarProps {
  onSignOut: () => void;
}

const Sidebar: FC<SidebarProps> = ({ onSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    const updateUserInfo = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const claims = parseJwt(token);
        setUserInfo({
          name: claims.name,
          email: claims.email
        });
      }
    };

    updateUserInfo();
    // Add event listener for storage changes
    window.addEventListener('storage', updateUserInfo);

    return () => {
      window.removeEventListener('storage', updateUserInfo);
    };
  }, []);

  const handleSignOut = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    // Call the onSignOut callback
    onSignOut();
    
    // Navigate to sign-in page
    navigate('/signin', { replace: true });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="app-title">
          <BsMusicNote className="logo-icon" />
          <h1 className="app-name">Music App</h1>
        </div>
        <div className="user-info">
          <div className="username">{userInfo.name}</div>
          <div className="email">{userInfo.email}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <BiHomeAlt className="nav-icon" />
          <span>Home</span>
        </Link>
        <Link to="/upload" className={`nav-item ${location.pathname === '/upload' ? 'active' : ''}`}>
          <BiUpload className="nav-icon" />
          <span>Upload</span>
        </Link>
        <Link to="/library" className={`nav-item ${location.pathname === '/library' ? 'active' : ''}`}>
          <BiLibrary className="nav-icon" />
          <span>Library</span>
        </Link>
        <Link to="/favorites" className={`nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}>
          <MdFavorite className="nav-icon" />
          <span>Favorites</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <BiUser className="nav-icon" />
          <span>Profile</span>
        </Link>
      </nav>

      <button className="sign-out-btn" onClick={handleSignOut}>
        <FiLogOut className="nav-icon" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default Sidebar;
