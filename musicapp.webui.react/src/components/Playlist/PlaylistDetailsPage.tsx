import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { parseJwt } from '../../utils/auth';
import { Song } from '../../types/music';
import { Playlist } from '../../types/playlist';
import MusicCard from '../Library/MusicCard';
import '../../styles/Playlist.css';

interface PlaylistDetailsPageProps {
  onSongSelect: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

const PlaylistDetailsPage = ({ onSongSelect, currentSong, isPlaying }: PlaylistDetailsPageProps) => {
  const { id } = useParams<{ id: string }>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlaylistSongs();
  }, [id]);

  const fetchPlaylistSongs = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch('http://localhost:7000/playlist/playlist-songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          playlistId: id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlist songs');
      }

      const result = await response.json();
      
      if (!result.successProperty) {
        if (result.message === "No songs found in this playlist.") {
          setSongs([]);
        } else {
          throw new Error(result.message || 'Failed to fetch playlist songs');
        }
      } else {
        setSongs(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching playlist songs:', err);
      //setError('Failed to load playlist songs.');
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

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch(`http://localhost:7000/playlist/remove-song`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          playlistId: id,
          songId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove song from playlist');
      }

      // Refresh the songs list
      await fetchPlaylistSongs();
    } catch (err) {
      console.error('Error removing song from playlist:', err);
      alert('Failed to remove song from playlist');
    }
  };

  if (loading) {
    return <div className="loading-message">Loading playlist...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="playlist-details-page">
      <div className="playlist-details-header">
        <h1>Playlist Songs</h1>
        <p>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</p>
      </div>

      {songs.length === 0 ? (
        <div className="no-songs-message">
          No songs found in this playlist. Add some songs!
        </div>
      ) : (
        <div className="music-grid">
          {songs.map(song => (
            <MusicCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id && isPlaying}
              onPlayPause={onSongSelect}
              onDelete={handleDeleteSong}
              showDeleteButton={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistDetailsPage;
