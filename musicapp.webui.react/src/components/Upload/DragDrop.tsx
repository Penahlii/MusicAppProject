import { useState, useRef } from 'react';
import { BiCloudUpload } from 'react-icons/bi';
import { DragDropProps } from '../../types/music';
import '../../styles/Upload.css';

const DragDrop: React.FC<DragDropProps> = ({ 
  onFileDrop, 
  acceptedFileTypes = ['.mp3'], 
  children 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (file && acceptedFileTypes.some(type => file.name.toLowerCase().endsWith(type))) {
      onFileDrop(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileDrop(files[0]);
    }
  };

  return (
    <div
      ref={dropRef}
      className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={handleFileInput}
        className="file-input"
      />
      {children || (
        <div className="drag-drop-content">
          <BiCloudUpload className="upload-icon" />
          <p>Drag & Drop your file here</p>
          <p className="or-text">or</p>
          <button className="browse-button">Browse Files</button>
          <p className="file-types">Accepted file types: {acceptedFileTypes.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default DragDrop;
