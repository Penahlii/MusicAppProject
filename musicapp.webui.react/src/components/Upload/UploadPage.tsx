import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiMusic, BiImage } from 'react-icons/bi';
import DragDrop from './DragDrop';
import { UploadSongRequest } from '../../types/music';
import '../../styles/Upload.css';

const UploadPage = () => {
  const navigate = useNavigate();
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSongDrop = (file: File) => {
    if (file.type === 'audio/mpeg' || file.name.endsWith('.mp3')) {
      setSongFile(file);
    } else {
      setError('Please upload an MP3 file');
    }
  };

  const handleCoverImageDrop = (file: File) => {
    if (file.type.startsWith('image/')) {
      setCoverImage(file);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!songFile || !coverImage || !title.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Get the user ID from the JWT token claims
      const token = localStorage.getItem('token');
      const claims = parseJwt(token || '');
      const userId = claims.nameidentifier;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('Title', title);
      formData.append('UploadedBy', userId);
      formData.append('SongFile', songFile);
      formData.append('CoverImage', coverImage);

      const response = await fetch('http://localhost:7000/song/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload song');
      }

      // Redirect to the library page after successful upload
      navigate('/library');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      const claims = JSON.parse(jsonPayload);
      return {
        name: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        email: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        nameidentifier: claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload Music</h1>
      {error && <div className="error-message">{error}</div>}
      
      {!songFile ? (
        <div className="upload-section">
          <h2>Select Music File</h2>
          <DragDrop 
            onFileDrop={handleSongDrop}
            acceptedFileTypes={['.mp3']}
          />
        </div>
      ) : (
        <div className="upload-form">
          <div className="selected-file">
            <BiMusic className="file-icon" />
            <span>{songFile.name}</span>
          </div>

          <div className="form-group">
            <label htmlFor="title">Song Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              required
            />
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            {coverImage ? (
              <div className="selected-file">
                <BiImage className="file-icon" />
                <span>{coverImage.name}</span>
              </div>
            ) : (
              <DragDrop
                onFileDrop={handleCoverImageDrop}
                acceptedFileTypes={['.jpg', '.jpeg', '.png']}
              />
            )}
          </div>

          <div className="buttons">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => {
                setSongFile(null);
                setCoverImage(null);
                setTitle('');
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="upload-button"
              onClick={handleSubmit}
              disabled={isLoading || !songFile || !coverImage || !title.trim()}
            >
              {isLoading ? 'Uploading...' : 'Upload Song'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
