export interface UploadSongRequest {
    title: string;
    uploadedBy: string;
    songFile: File;
    coverImage: File;
}

export interface Song {
    id: number;
    title: string;
    albumCover: string;
    filePath: string;
    uploadedBy: string;
    uploadedAt: string;
}

export interface DragDropProps {
    onFileDrop: (file: File) => void;
    acceptedFileTypes?: string[];
    children?: React.ReactNode;
}
