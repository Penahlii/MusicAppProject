import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsCollectionPlay } from 'react-icons/bs';
import MusicCard from '../Library/MusicCard';
import { Song } from '../../types/music';
import { parseJwt } from '../../utils/auth';
import '../../styles/Home.css';

interface HomePageProps {
  onSongSelect: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

const HomePage = ({ onSongSelect, currentSong, isPlaying }: HomePageProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const claims = parseJwt(token);
      setUserId(claims.nameidentifier);
      fetchAllSongs(claims.nameidentifier);
    }
  }, []);

  const fetchAllSongs = async (currentUserId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:7000/song/all-songs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSongs([]);
          return;
        }
        throw new Error('Failed to fetch songs');
      }

      const data = await response.json();
      // Filter out the user's own songs
      const otherUsersSongs = data.filter((song: Song) => {
        // Make sure both IDs are strings and compare them
        const songUploaderId = String(song.uploadedBy);
        const currentId = String(currentUserId);
        return songUploaderId !== currentId;
      });
      setSongs(otherUsersSongs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="home-loading">Loading songs...</div>;
  }

  if (error) {
    return <div className="home-error">{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-title">
          <h1>Discover Music</h1>
          <p>Listen to songs shared by other people</p>
        </div>
        <Link to="/library" className="library-link">
          <BsCollectionPlay />
          <span>Go to My Library</span>
        </Link>
      </div>

      {songs.length === 0 ? (
        <div className="no-songs">
          <p>No music has been shared yet. Be the first to share your favorite tunes!</p>
        </div>
      ) : (
        <div className="music-grid">
          {songs.map(song => (
            <MusicCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id && isPlaying}
              onPlayPause={() => onSongSelect(song)}
              onDelete={() => {}} // Empty function since delete is not needed in home page
              showDeleteButton={false}
              showDownloadButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
