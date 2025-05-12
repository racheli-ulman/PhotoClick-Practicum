export interface Album {
    id: number,
    userId: number|null,
    albumName: string,
    description:string
    createdAt: Date,
    // images: string[]; // מערך של כתובות URL לתמונות
}
export interface SelectedAlbum {
    id: number;
    albumname: string;
  }