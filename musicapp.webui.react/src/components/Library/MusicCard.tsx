import { FC, useState } from 'react';
import { BsPlayFill, BsPauseFill, BsMusicNote, BsTrash, BsDownload, BsPlus } from 'react-icons/bs';
import { Song } from '../../types/music';
import { Playlist } from '../../types/playlist';
import { parseJwt } from '../../utils/auth';
import FavoriteButton from '../Common/FavoriteButton';
import ContextMenu from '../Common/ContextMenu';
import '../../styles/Library.css';

interface MusicCardProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: (song: Song) => void;
  onDelete: (songId: string) => void;
  onFavoriteChange: () => void;
  showDeleteButton?: boolean;
  showDownloadButton?: boolean;
}

const MusicCard: FC<MusicCardProps> = ({ 
  song, 
  isPlaying, 
  onPlayPause,
  onDelete,
  onFavoriteChange,
  showDeleteButton = false,
  showDownloadButton = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
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

      const result = await response.json();
      setPlaylists(result.data || []);
      setContextMenu({ x: e.clientX, y: e.clientY });
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setPlaylists([]);
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      setIsAddingToPlaylist(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch('http://localhost:7000/playlist/add-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          playlistId,
          songId: song.id,
          userId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add song to playlist');
      }

      alert('Song added to playlist successfully!');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      alert(error instanceof Error ? error.message : 'Failed to add song to playlist');
    } finally {
      setIsAddingToPlaylist(false);
      setContextMenu(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(song.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const response = await fetch(song.filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading song:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div 
        className="music-card" 
        onClick={() => onPlayPause(song)}
        onContextMenu={handleContextMenu}
      >
        <div className="music-card-cover">
          {!imageError ? (
            <img 
              src={song.albumCover}
              alt={song.title}
              onError={handleImageError}
            />
          ) : (
            <div className="fallback-image">
              <BsMusicNote className="fallback-icon" />
            </div>
          )}
          <button 
            className="play-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPlayPause(song);
            }}
            disabled={isDeleting}
          >
            {isPlaying ? (
              <BsPauseFill className="play-icon" />
            ) : (
              <BsPlayFill className="play-icon" />
            )}
          </button>
        </div>
        <div className="music-card-actions">
          <FavoriteButton
            musicId={song.id}
            onFavoriteChange={onFavoriteChange}
          />
          {showDeleteButton && (
            <button
              className="action-button delete-button"
              onClick={(e) => {
                if (window.confirm('Are you sure you want to delete this song?')) {
                  handleDelete(e);
                }
              }}
              disabled={isDeleting}
              title="Delete song"
            >
              <BsTrash />
            </button>
          )}
          {showDownloadButton && (
            <button
              className="action-button download-button"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download song"
            >
              <BsDownload />
            </button>
          )}
        </div>
        <div className="music-card-info">
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        >
          <div className="context-menu-content">
            <h3>Add to Playlist</h3>
            {playlists.length === 0 ? (
              <p>You don't have any playlists yet. Create one first!</p>
            ) : (
              <div className="playlist-list">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    className="playlist-item"
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={isAddingToPlaylist}
                  >
                    <BsPlus className="playlist-icon" />
                    {playlist.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ContextMenu>
      )}
    </>
  );
};

export default MusicCard;
