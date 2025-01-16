import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import UploadPage from './components/Upload/UploadPage';
import LibraryPage from './components/Library/LibraryPage';
import MusicPlayer from './components/Player/MusicPlayer';
import ProfilePage from './components/Profile/ProfilePage';
import HomePage from './components/Home/HomePage';
import PlaylistPage from './components/Playlist/PlaylistPage';
import PlaylistDetailsPage from './components/Playlist/PlaylistDetailsPage';
import { Song } from './types/music';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClosePlayer = () => {
    setCurrentSong(null);
    setIsPlaying(false);
  };

  const handleSongSelect = (song: Song) => {
    if (currentSong?.id === song.id) {
      handlePlayPause();
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Sidebar onSignOut={handleSignOut} />}
        <div className={isAuthenticated ? 'main-content' : 'auth-page'}>
          <Routes>
            <Route path="/signin" element={
              isAuthenticated ? 
                <Navigate to="/library" /> : 
                <SignIn setIsAuthenticated={setIsAuthenticated} />
            } />
            <Route path="/signup" element={
              isAuthenticated ? 
                <Navigate to="/library" /> : 
                <SignUp setIsAuthenticated={setIsAuthenticated} />
            } />
            <Route path="/" element={
              isAuthenticated ? 
                <HomePage 
                  onSongSelect={handleSongSelect}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                /> : 
                <Navigate to="/signin" />
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <LibraryPage 
                  onSongSelect={handleSongSelect}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                />
              </ProtectedRoute>
            } />
            <Route path="/playlist" element={
              <ProtectedRoute>
                <PlaylistPage />
              </ProtectedRoute>
            } />
            <Route path="/playlist/:id" element={
              <ProtectedRoute>
                <PlaylistDetailsPage 
                  onSongSelect={handleSongSelect}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <div>Favorites Page</div>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/playlists" element={
              <ProtectedRoute>
                <PlaylistPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        {currentSong && (
          <MusicPlayer
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </Router>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/signin" />;
  }
  return <>{children}</>;
};

export default App;
