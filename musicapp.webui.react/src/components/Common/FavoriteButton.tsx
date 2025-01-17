import { FC, useState, useEffect } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { parseJwt } from '../../utils/auth';

interface FavoriteButtonProps {
  musicId: string;
  onFavoriteChange: () => void;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({ musicId, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch(
        `http://localhost:7000/favorite/check-favorite?userId=${userId}&musicId=${musicId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        setIsFavorite(result);
      }
    } catch (err) {
      console.error('Error checking favorite status:', err);
    }
  };

  useEffect(() => {
    checkFavoriteStatus();
  }, [musicId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch(
        `http://localhost:7000/favorite/${isFavorite ? 'remove' : 'add'}?userId=${userId}&musicId=${musicId}`,
        {
          method: isFavorite ? 'DELETE' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
      }

      await checkFavoriteStatus();
      onFavoriteChange();
    } catch (err) {
      console.error('Error updating favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`action-button favorite-button ${isFavorite ? 'favorited' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? (
        <BsHeartFill className="heart-icon filled" />
      ) : (
        <BsHeart className="heart-icon" />
      )}
    </button>
  );
};

export default FavoriteButton;
