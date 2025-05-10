export interface Album {
    id?: number,
    userId: number|null,
    albumName: string,
    description:string
    // images: string[]; // מערך של כתובות URL לתמונות
}
export interface SelectedAlbum {
    id: number;
    name: string;
  }