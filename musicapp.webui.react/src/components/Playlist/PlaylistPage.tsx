import { useState, useEffect } from 'react';
import { BsMusicNoteList, BsPlus, BsExclamationTriangle } from 'react-icons/bs';
import { parseJwt } from '../../utils/auth';
import { Playlist, ApiResponse } from '../../types/playlist';
import '../../styles/Playlist.css';

const PlaylistPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  const fetchUserPlaylists = async () => {
    try {
      setIsLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch(`http://localhost:7000/playlist/user-playlists/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }

      const result: ApiResponse<Playlist[]> = await response.json();
      
      if (!result.successProperty) {
        throw new Error(result.message || 'Failed to fetch playlists');
      }

      setPlaylists(result.data || []);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('No playlists available to display.');
      setPlaylists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistTitle.trim()) {
      setError('Please enter a playlist title');
      return;
    }

    try {
      setIsCreating(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch('http://localhost:7000/playlist/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newPlaylistTitle.trim(),
          userId: userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create playlist');
      }

      const result: ApiResponse<Playlist> = await response.json();
      
      if (!result.successProperty) {
        throw new Error(result.message || 'Failed to create playlist');
      }

      setPlaylists([...playlists, result.data]);
      setNewPlaylistTitle('');
      setShowCreateModal(false);
      
      // Refresh the playlists
      await fetchUserPlaylists();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="playlist-page">
      <div className="playlist-header">
        <div className="playlist-title">
          <BsMusicNoteList className="playlist-icon" />
          <h1>My Playlists</h1>
        </div>
        <button
          className="create-playlist-button"
          onClick={() => setShowCreateModal(true)}
        >
          <BsPlus />
          Create Playlist
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="playlists-grid">
        {isLoading ? (
          <div className="loading-message">Loading playlists...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : playlists.length === 0 ? (
          <div className="no-playlists-message">No playlists available to display.</div>
        ) : (
          playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-card">
              <div className="playlist-card-content">
                <BsMusicNoteList className="playlist-card-icon" />
                <h3>{playlist.title}</h3>
                <p className="playlist-date">Created: {new Date(playlist.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Playlist</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleCreatePlaylist}>
              <div className="form-group">
                <label htmlFor="playlistTitle">Playlist Title</label>
                <input
                  type="text"
                  id="playlistTitle"
                  value={newPlaylistTitle}
                  onChange={(e) => setNewPlaylistTitle(e.target.value)}
                  placeholder="Enter playlist title"
                  disabled={isCreating}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPlaylistTitle('');
                    setError('');
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-button"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Playlist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
