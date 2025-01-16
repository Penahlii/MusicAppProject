import { FC, useState } from 'react';
import { BsPlayFill, BsPauseFill, BsMusicNote, BsTrash, BsDownload } from 'react-icons/bs';
import { Song } from '../../types/music';
import '../../styles/Library.css';

interface MusicCardProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: (song: Song) => void;
  onDelete: (songId: string) => void;
  showDeleteButton?: boolean;
  showDownloadButton?: boolean;
}

const MusicCard: FC<MusicCardProps> = ({ 
  song, 
  isPlaying, 
  onPlayPause, 
  onDelete,
  showDeleteButton = false,
  showDownloadButton = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this song?')) {
      setIsDeleting(true);
      try {
        await onDelete(song.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:7000/song/download/${song.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download song');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.title}.mp3`; // Set the filename
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading song:', error);
      alert('Failed to download song. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="music-card">
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
          onClick={() => onPlayPause(song)}
          disabled={isDeleting}
        >
          {isPlaying ? (
            <BsPauseFill className="play-icon" />
          ) : (
            <BsPlayFill className="play-icon" />
          )}
        </button>
        {showDeleteButton && (
          <button 
            className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete song"
          >
            <BsTrash />
          </button>
        )}
        {showDownloadButton && (
          <button
            className="download-button"
            onClick={handleDownload}
            disabled={isDownloading}
            title="Download song"
          >
            <BsDownload />
          </button>
        )}
      </div>
      <div className="music-card-info">
        <h3 className="music-title" title={song.title}>
          {song.title}
          <span className="title-tooltip">{song.title}</span>
        </h3>
      </div>
    </div>
  );
};

export default MusicCard;
