import { FC, useState, useEffect } from 'react';
import MusicCard from './MusicCard';
import { Song } from '../../types/music';
import { parseJwt } from '../../utils/auth';
import '../../styles/Library.css';

interface LibraryPageProps {
  onSongSelect: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

const LibraryPage: FC<LibraryPageProps> = ({ onSongSelect, currentSong, isPlaying }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserSongs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch(`http://localhost:7000/song/usersongs/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }

      const data = await response.json();
      setSongs(data);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSongs();
  }, []);

  const handlePlayPause = (song: Song) => {
    if (currentlyPlaying === song.id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(song.id);
    }
    onSongSelect(song);
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:7000/song/${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete song');
      }

      setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Failed to delete song. Please try again.');
    }
  };

  if (loading) {
    return <div className="library-loading">Loading...</div>;
  }

  if (error) {
    return <div className="library-error">{error}</div>;
  }

  return (
    <div className="library-container">
      <div className="library-header">
        <h1>My Music Library</h1>
      </div>
      {songs.length === 0 ? (
        <div className="no-songs">
          <p>Your library is empty. Start by adding some songs!</p>
        </div>
      ) : (
        <div className="library-grid">
          {songs.map((song) => (
            <MusicCard
              key={song.id}
              song={song}
              isPlaying={currentlyPlaying === song.id}
              onPlayPause={handlePlayPause}
              onDelete={handleDeleteSong}
              onFavoriteChange={fetchUserSongs}
              showDeleteButton
              showDownloadButton
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
