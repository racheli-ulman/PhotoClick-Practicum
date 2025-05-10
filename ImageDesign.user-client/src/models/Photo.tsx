export interface Photo {
    Id?:number
    UserId: number,
    PhotoName: string,
    AlbumId:number,
    PhotoPath?: string,
    PhotoSize: number,
    isDeleted?: boolean,
    // UploadedAt?:Date
    tagId:string
  } 