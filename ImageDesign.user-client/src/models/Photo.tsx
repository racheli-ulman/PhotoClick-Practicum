export interface Photo {
    id:number
    userId: number,
    photoName: string,
    albumId:number,
    photoPath: string,
    photoSize: number,
    isDeleted?: boolean,
    // UploadedAt?:Date
    tagId:string
  } 