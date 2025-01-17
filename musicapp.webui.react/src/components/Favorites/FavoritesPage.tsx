import { FC, useState, useEffect } from 'react';
import FavoriteMusicCard from './FavoriteMusicCard';
import { Song } from '../../types/music';
import { parseJwt } from '../../utils/auth';
import '../../styles/Favorites.css';

interface FavoritesPageProps {
  onSongSelect: (song: Song) => void;
  currentSong: Song | null;
  isPlaying: boolean;
}

const FavoritesPage: FC<FavoritesPageProps> = ({ onSongSelect, currentSong, isPlaying }) => {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const claims = parseJwt(token);
      const userId = claims.nameidentifier;

      const response = await fetch(
        `http://localhost:7000/favorite/user-favorites/${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch favorites: ${errorText}`);
      }

      const result = await response.json();
      const favoriteSongs = result.data || result || [];
      setFavorites(favoriteSongs);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handlePlayPause = (song: Song) => {
    onSongSelect(song);
  };

  if (loading) {
    return <div className="favorites-loading">Loading...</div>;
  }

  if (error) {
    return <div className="favorites-error">{error}</div>;
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Favorites</h1>
      </div>
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You haven't added any songs to your favorites yet.</p>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map((song) => (
            <FavoriteMusicCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id && isPlaying}
              onPlayPause={handlePlayPause}
              onRemoveFromFavorites={fetchFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
