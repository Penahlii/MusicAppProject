import { FC, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BsMusicNote, BsMusicNoteList, BsUpload, BsHeart, BsCollection, BsPerson, BsBoxArrowLeft, BsHouse, BsPlayCircle, BsPlusCircle, BsPersonCircle } from 'react-icons/bs';
import { MdFavorite } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
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
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <BsHouse className="nav-icon" />
          <span>Home</span>
        </Link>
        <Link to="/upload" className={`nav-item ${location.pathname === '/upload' ? 'active' : ''}`}>
          <BsUpload className="nav-icon" />
          <span>Upload</span>
        </Link>
        <Link to="/library" className={`nav-item ${location.pathname === '/library' ? 'active' : ''}`}>
          <BsPlayCircle className="nav-icon" />
          <span>Library</span>
        </Link>
        <Link to="/playlists" className={`nav-item ${location.pathname === '/playlists' ? 'active' : ''}`}>
          <BsPlusCircle className="nav-icon" />
          <span>Playlists</span>
        </Link>
        <Link to="/favorites" className={`nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}>
          <BsHeart className="nav-icon" />
          <span>Favorites</span>
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <BsPersonCircle className="nav-icon" />
          <span>Profile</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item sign-out" onClick={handleSignOut}>
          <BsBoxArrowLeft className="nav-icon" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
