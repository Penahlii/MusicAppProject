import { FC } from 'react';
import { BsPlayFill, BsPauseFill, BsHeartFill } from 'react-icons/bs';
import { Song } from '../../types/music';
import { parseJwt } from '../../utils/auth';

interface FavoriteMusicCardProps {
  song: Song;
  isPlaying: boolean;
  onPlayPause: (song: Song) => void;
  onRemoveFromFavorites: () => void;
}

const FavoriteMusicCard: FC<FavoriteMusicCardProps> = ({
  song,
  isPlaying,
  onPlayPause,
  onRemoveFromFavorites
}) => {
  const handleRemoveFromFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch(
        `http://localhost:7000/favorite/remove?userId=${userId}&musicId=${song.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      onRemoveFromFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <div className="favorite-music-card">
      <div className="favorite-music-card-left">
        <div className="favorite-music-card-cover">
          <img src={song.albumCover} alt={song.title} />
        </div>
        <div className="favorite-music-card-info">
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>
      </div>
      <div className="favorite-music-card-center">
        <button
          className="favorite-play-button"
          onClick={() => onPlayPause(song)}
        >
          {isPlaying ? (
            <BsPauseFill className="favorite-play-icon" />
          ) : (
            <BsPlayFill className="favorite-play-icon" />
          )}
        </button>
      </div>
      <div className="favorite-music-card-right">
        <button
          className="favorite-heart-button"
          onClick={handleRemoveFromFavorites}
          title="Remove from favorites"
        >
          <BsHeartFill className="favorite-heart-icon" />
        </button>
      </div>
    </div>
  );
};

export default FavoriteMusicCard;
