import { FC } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { parseJwt } from '../../utils/auth';

interface FavoriteButtonProps {
  musicId: string;
  isFavorite: boolean;
  onFavoriteChange: (newStatus: boolean) => void;
  disabled?: boolean;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({ 
  musicId, 
  isFavorite, 
  onFavoriteChange,
  disabled = false 
}) => {
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    try {
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

      const result = await response.json();
      if (result.successProperty) {
        onFavoriteChange(!isFavorite);
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };

  return (
    <button
      className={`action-button favorite-button ${isFavorite ? 'favorited' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? <BsHeartFill /> : <BsHeart />}
    </button>
  );
};

export default FavoriteButton;
