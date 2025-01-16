import { useState, useEffect } from 'react';
import MusicCard from './MusicCard';
import { Song } from '../../types/music';
import { parseJwt } from '../../utils/auth';
import '../../styles/Library.css';

interface LibraryPageProps {
  onSongSelect: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

const LibraryPage = ({ onSongSelect, currentSong, isPlaying }: LibraryPageProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserSongs();
  }, []);

  const fetchUserSongs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSongs([]);
        return;
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch(`http://localhost:7000/song/usersongs/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        setSongs([]);
        return;
      }

      const data = await response.json();
      setSongs(data);
    } catch (err) {
      setSongs([]);
    } finally {
      setLoading(false);
    }
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

      // Remove the song from the local state
      setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete song');
    }
  };

  if (loading) {
    return <div className="library-loading">Loading songs...</div>;
  }

  if (error) {
    return <div className="library-error">{error}</div>;
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>My Library</h1>
      </div>

      {songs.length === 0 ? (
        <div className="no-songs">
          <p>No songs available to display.</p>
        </div>
      ) : (
        <div className="music-grid">
          {songs.map(song => (
            <MusicCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id && isPlaying}
              onPlayPause={() => onSongSelect(song)}
              onDelete={() => handleDeleteSong(song.id)}
              showDeleteButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
