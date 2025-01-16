import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsMusicNoteList, BsPlus, BsExclamationTriangle, BsTrash } from 'react-icons/bs';
import { parseJwt } from '../../utils/auth';
import { Playlist, ApiResponse } from '../../types/playlist';
import '../../styles/Playlist.css';

const PlaylistPage = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      //setError('No playlists available to display.');
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

  const handleDeleteClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setShowDeleteModal(true);
    setError('');
  };

  const handleDeletePlaylist = async () => {
    if (!selectedPlaylist) return;

    try {
      setIsDeleting(true);
      setError('');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch('http://localhost:7000/playlist/remove-playlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          playlistId: selectedPlaylist.id.toString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete playlist');
      }

      // Remove the deleted playlist from the state
      setPlaylists(playlists.filter(p => p.id !== selectedPlaylist.id));
      setShowDeleteModal(false);
      setSelectedPlaylist(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete playlist');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    navigate(`/playlist/${playlist.id}`);
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

      <div className="playlists-grid">
        {isLoading ? (
          <div className="loading-message">Loading playlists...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : playlists.length === 0 ? (
          <div className="no-playlists-message">You don't have any playlists yet.</div>
        ) : (
          playlists.map((playlist) => (
            <div 
              key={playlist.id} 
              className="playlist-card"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="playlist-card-content">
                <BsMusicNoteList className="playlist-card-icon" />
                <h3>{playlist.title}</h3>
                <p className="playlist-date">
                  Created: {new Date(playlist.createdAt).toLocaleDateString()}
                </p>
                <button 
                  className="delete-playlist-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(playlist);
                  }}
                >
                  <BsTrash />
                </button>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPlaylist && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Playlist</h2>
            <div className="delete-warning">
              <BsExclamationTriangle className="warning-icon" />
              <p>Are you sure you want to delete "{selectedPlaylist.title}"? This action cannot be undone.</p>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedPlaylist(null);
                  setError('');
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={handleDeletePlaylist}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Playlist'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
