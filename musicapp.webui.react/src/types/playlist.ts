export interface Playlist {
    id: number;
    title: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string | null;
    playlistSongs: any[]; // We'll type this properly when we implement playlist songs
}

export interface CreatePlaylistDTO {
    title: string;
    userId: string;
}

export interface ApiResponse<T> {
    successProperty: boolean;
    message: string;
    data: T;
}
