import { useState, useEffect, useRef } from 'react';
import { BsPlayFill, BsPauseFill, BsVolumeUp, BsVolumeMute, BsX } from 'react-icons/bs';
import { Song } from '../../types/music';
import '../../styles/MusicPlayer.css';

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onClose: () => void;
}

const MusicPlayer = ({ currentSong, isPlaying, onPlayPause, onClose }: MusicPlayerProps) => {
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
    }
  };

  const handleVolumeClick = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  if (!currentSong) return null;

  return (
    <div className="music-player">
      <div className="player-left">
        <img 
          src={currentSong.albumCover} 
          alt={currentSong.title} 
          className="player-cover"
        />
        <div className="player-song-info">
          <div className="player-title">{currentSong.title}</div>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button 
            className="play-pause-button"
            onClick={onPlayPause}
          >
            {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
          </button>
        </div>

        <div className="player-progress">
          <span className="time-current">{formatTime(currentTime)}</span>
          <div 
            className="progress-bar" 
            ref={progressBarRef}
            onClick={handleProgressClick}
          >
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="time-total">{formatTime(duration)}</span>
        </div>

        <audio
          ref={audioRef}
          src={currentSong.filePath}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      <div className="player-right">
        <button 
          className="volume-button"
          onClick={handleVolumeClick}
        >
          {isMuted || volume === 0 ? <BsVolumeMute /> : <BsVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
        <button 
          className="close-button"
          onClick={onClose}
          title="Close Player"
        >
          <BsX />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
